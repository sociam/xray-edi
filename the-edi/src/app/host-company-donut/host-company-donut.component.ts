import { Component, OnInit, ViewChild, Input, ElementRef, HostListener, HostBinding } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { FullApp } from '../service/app-info-types.service';
import { Router, NavigationEnd } from '@angular/router';
import { CompanyInfoService, CompanyInfo } from '../service/company-info.service';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-host-company-donut',
  templateUrl: './host-company-donut.component.html',
  styleUrls: ['./host-company-donut.component.scss']
})
export class HostCompanyDonutComponent implements OnInit {

@Input() onlySingle: boolean = true;

  @ViewChild('chart') chart: ElementRef;
  private child: ElementRef;
  private dataset: any = [{label:'', value: 0, app: []}];

  // https://bl.ocks.org/mbostock/4062045
  private chartWidth: number;
  private chartHeight: number;

  constructor(private appTracker: SelectionTrackingService,
              private router: Router,
              private el: ElementRef,
              private companyLookup: CompanyInfoService) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd ) {
        this.buildGraph(this.dataset);
      }
    });
  }

  buildDataset(selection: FullApp[]) {
    // [ ...,
    //  { label: facebook, value: n / N, apps: [facebook, cats, snapchat,]},
    //  ... ]
    let bigN = 0
    let companies = selection.map((app, idx) => {
      bigN += app.hosts.length;
      return app.hosts.map((host) => {
        let mapping = this.companyLookup.getCompanyFromDomain(host).map((company: CompanyInfo) => company.id );
        let pair = {company: '', app: ''}
        if (mapping.length == 0) {
          return {company: 'Unknown', app: app.storeinfo.title}
        }
        return {company: mapping[0], app: app.storeinfo.title};
      })
    }).reduce((a,b) => a.concat(b),[]);
    let freq = _.countBy(companies, 'company');

    if (!freq) {
      return [{label:'', value: 0}];
    }
    let data = _.sortBy(_.keys(freq).map((key) =>  {
      return {
        label: key,
        value: freq[key]/bigN,
        apps: _.uniq(companies.filter((el) => el.company == key).map((el) => el.app))
      }
    }),'value');
  console.log(data);
  return data;
  }

  buildGraph(dataset) {
    var svg = d3.select(this.chart.nativeElement);
    svg.selectAll('*').remove();
    this.chartHeight = this.el.nativeElement.children[0].offsetHeight;
    this.chartWidth = this.el.nativeElement.children[0].offsetWidth;

    var radius = Math.min(this.chartWidth / 3, this.chartHeight / 3);
    // Set the height and width of the SVG element.
    svg.attr('height', this.el.nativeElement.children[0].offsetHeight);
    svg.attr('width', this.el.nativeElement.children[0].offsetWidth);

    svg.append('g')
       .attr('class','slices');
    svg.append('g')
       .attr('class', 'labels');
    svg.append('g')
       .attr('class', 'lines');

    var pie = d3.pie()
                .sort(null)
                .value((d) => {
                  return d.value
                })

    
    var arc = d3.arc()
                .outerRadius(radius * 0.8)
	              .innerRadius(radius * 0.4)
                .startAngle(function(d) { return d.startAngle + Math.PI/3.333; })
                .endAngle(function(d) { return d.endAngle + Math.PI/3.333; })

                
    var outerArc = d3.arc()
                     .innerRadius(radius * 0.9)
                     .outerRadius(radius * 0.9)
                     .startAngle(function(d) { return d.startAngle + Math.PI/3.333; })
                     .endAngle(function(d) { return d.endAngle + Math.PI/3.333; });

    //svg.attr('transform', 'translate(' + this.chartWidth/2 + ',' + this.chartHeight / 2 + ')')
    svg.selectAll('g').attr('transform', 'translate(' + this.chartWidth/2 + ',' + this.chartHeight / 2 + ')')

    var key = (d) => {return d.data.label};

    var colour = d3.scaleOrdinal(d3.schemeCategory20);
    var data = this.dataset;
    var slice = svg.select('.slices').selectAll('path.slice')
         .data(pie(data), key)
         .enter()
         .insert('path')
         .style('fill', (d) => { return colour(d.data.label) })
         .attr('class', slice);
         
    slice.transition().duration(1000)
		     .attrTween('d', function(d) {
           this._current = this._current || d;
           let interpolate = d3.interpolate(this._current, d);
           this._current = interpolate(0);
           return function(t) {
             return arc(d);
           };
      })
      
    var div = d3.select("body").append("div").attr("class", "toolTip");
    div
    .style('position', 'absolute')
    .style('display', 'none')
    .style('width', 'auto')
    .style('height', 'auto')
    .style('background', '#222')
    .style('border', '0 none')
    .style('border', 'radius 8px 8px 8px 8px')
    .style('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)')
    .style('color', '#fff')
    .style('font-size', '0.75em')
    .style('padding', '5px')
    .style('text-align', 'left');

    slice
        .on("mousemove", (d) => {
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html(d.data.apps.reduce((a,b) => a+'<br>'+b));
        });

    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });
    slice.exit()
         .remove();
         
    var text = svg.select('.labels').selectAll('text')
		              .data(pie(data), key);
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
  }
  
	text.enter()
		.append('text')
    .attr('dy', '.35em')
    .attr('font-size', '0.7em')
    .attr('transform', (d) => {
        var pos = outerArc.centroid(d);
				pos[0] = radius * (midAngle(d) < Math.PI - Math.PI/3 ? 1 : -1);
        return 'translate('+ pos +')';
        
    })
    .attr('text-anchor',  (d) => midAngle(d) < Math.PI - Math.PI/3 ? 'start':'end')
		.text(function(d) {
			return d.data.label;
		});
	

    text.exit()
      .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select('.lines').selectAll('polyline')
      .data(pie(data), key);
    
    polyline.enter()
      .append('polyline')
      .attr('opacity', '0.3')
	    .attr('stroke', '#000')
	    .attr('stroke-width', '2px')
      .attr('fill', 'none')
      .attr('points', (d) => {
        var pos = outerArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) <  Math.PI - Math.PI/3 ? 1 : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos];
      })

    polyline.exit()
      .remove();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
      this.buildGraph(this.dataset);
  }

  private graphInit() {
    /* This makes me wanna Vom. pls forgive. this was a quick fix, cba to fix it up, have other things to do. */
    if(this.onlySingle) {
          let selection = this.appTracker.getCurrentSelection();
          if(selection) {
            this.dataset = this.buildDataset(Array.from([this.appTracker.getCurrentSelection()]));
          }
        }
        else {
          let selection = this.appTracker.getSelections();
          this.dataset = this.buildDataset(Array.from(selection.keys()).map((key) => selection.get(key)));

        }
        this.buildGraph(this.dataset);


        this.appTracker.currentSelectionChanged.subscribe((data) => {
          if(this.onlySingle) {
            this.dataset = this.buildDataset(Array.from([this.appTracker.getCurrentSelection()]));
          }
        });

        this.appTracker.appSelectionsChanged.subscribe((data) => {
          if(!this.onlySingle) {
            let selection = this.appTracker.getSelections();
            this.dataset = this.buildDataset(Array.from(selection.keys()).map((key) => selection.get(key)));
          }
          this.buildGraph(this.dataset);

        });
  }
  ngOnInit(): void {
    this.companyLookup.parseCompanyInfo();
    this.companyLookup.companyInfoParsed.subscribe((d) => {this.graphInit()});
    // Select the HTMl SVG Element from the template
  }

}
