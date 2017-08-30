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
  private dataset: any = {links:[], nodes:[]}

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
    //  { label: facebook, value: n / N },
    //  ... ]
    return selection.map((app, idx) => {
      let bigN = app.hosts.length;
      let companies = app.hosts.map((host) => {
        let mapping = this.companyLookup.getCompanyFromDomain(host).map((company: CompanyInfo) => {
          return company.id;
        })
        if (mapping.length == 0) {
          mapping = ['Uknown'];
        }
        return mapping;
      }).reduce((a,b) => a.concat(b),[])
      let freq = _.countBy(companies, _.identity);
      return _.keys(freq).map((key) => {
        return {label: key, value: freq[key]/bigN}
      })
    })[0];
  }

  buildGraph(dataset) {
    var svg = d3.select(this.chart.nativeElement);
    svg.selectAll('*').remove();
    this.chartHeight = this.el.nativeElement.children[0].offsetHeight;
    this.chartWidth = this.el.nativeElement.children[0].offsetWidth;

    var radius = Math.min(this.chartWidth / 2, this.chartHeight / 2);
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
	              .innerRadius(radius * 0.4);

    var outerArc = d3.arc()
                     .innerRadius(radius * 0.9)
	                   .outerRadius(radius * 0.9);

    svg.attr('transform', 'translate(' + this.chartWidth/2 + ',' + this.chartHeight / 2 + ')')
    
    var key = (d) => {return d.data.label};

    var colour = d3.scaleOrdinal(d3.schemeCategory20);
    let data = this.dataset;
    var slice = svg.select('.slices').selectAll('path.slice')
         .data(pie(data), key)
         .enter()
         .insert('path')
         .style('fill', (d) => { return colour(d.data.label) })
         .attr('class', slice);
    slice.transition().duration(1000)
		     .attrTween('d', function(d) {
           this._current = this._current || d;
           var interpolate = d3.interpolate(this._current, d);
           this._current = interpolate(0);
           return function(t) {
             return arc(interpolate(t));
           };
      })
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
				pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
        return 'translate('+ pos +')';
        
    })
    .attr('text-anchor',  (d) => midAngle(d) < Math.PI ? 'start':'end')
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
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
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
    this.companyLookup.companyInfoParsed.subscribe((d) => {this.graphInit(); this.graphInit()});
    // Select the HTMl SVG Element from the template
  }

}
