import { Component, OnInit, ViewChild, Input, ElementRef, HostListener, HostBinding } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { Router, NavigationEnd } from '@angular/router';
import { CompanyInfoService, CompanyInfo } from '../service/company-info.service';
import { FullApp, CompanyGenreCoverage, CompanyStats } from '../service/app-info-types.service';
import { XrayAPIService } from '../service/xray-api.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as colours from 'd3-scale-chromatic';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-genre-coverage-display',
  templateUrl: './company-genre-coverage-display.component.html',
  styleUrls: ['./company-genre-coverage-display.component.scss']
})
export class CompanyGenreCoverageDisplayComponent implements OnInit {


  public selectedGenres: string[] = ['All','None','None','None','None'];
  public colours: string[] = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099"];
  public possibleDropdowns: string[] = ['first', 'second', 'third', 'fourth', 'fifth'];
  public dropdowns: string[] = [];
  @ViewChild('companyTypes') chart: ElementRef;
  private child: ElementRef;
  private dataset: any = [{label:'', value: 0, app: []}];
  public genres: string[] = [];
  public scrollOffset: number = 0;

  // https://bl.ocks.org/mbostock/4062045
  private chartWidth: number;
  private chartHeight: number;

  private genreStatsSubscription: Subscription = new Subscription();
  private companyStatsSubscription: Subscription = new Subscription();
  public loadingComplete: boolean = false;

  constructor(private appTracker: SelectionTrackingService,
              private xrayAPI: XrayAPIService,
              private router: Router,
              private el: ElementRef,
              private companyLookup: CompanyInfoService) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd ) {
        this.buildGraph(this.dataset);
      }
    });
  }

  buildDataset(companyGenreData: CompanyGenreCoverage[], companyData: CompanyStats[]) {
    // [{label: string, value: float}]
    this.genres = ['None'].concat(companyGenreData.map((data) => data.genre.replace(/_/g, ' ').toLowerCase()).filter((v, i, arr) => arr.indexOf(v) === i).concat(['All', 'All Games']).sort((a,b) => a.localeCompare(b)));
    const companies = companyData.map((data) => data.company).filter((v, i, arr) => arr.indexOf(v) === i);
    this.dropdowns = [];
    this.selectedGenres.forEach((g) => this.dropdowns.push(g == 'None' ? 'none' : this.possibleDropdowns[this.dropdowns.filter((g) => g != 'none').length]));
    console.log(this.dropdowns);
    return this.selectedGenres.filter((g) => g != 'None').map((selectedGenre, idx) => {
      // Across all Genres
      if (selectedGenre == 'All') {
        let dataset = companyData.map((company) => {
          return {
            label: company.company,
            type: company.type == 'app' ? 'functionality' : company.type, 
            value: company.companyFreq*100,
            genre: selectedGenre,
            genreIdx: idx
          }
        });
        return dataset.sort((a,b) =>  b.value - a.value).map((company, idx) => {
          return {label: company.label,type: company.type, value: company.value, idx: idx, genre: company.genre, genreIdx: company.genreIdx, idName: company.label.replace(/[.\s]/g, '-')}
        }).slice(this.scrollOffset,this.scrollOffset + 10);
      }

      // accross all games
      if(selectedGenre == 'All Games') {
        let selectedGenreData = companyGenreData.filter((companyGenre) => companyGenre.genre.toUpperCase().includes('GAME'));
        let possibleCompanies = selectedGenreData.map((d) => d.company).filter((v, i, arr) => arr.indexOf(v) === i);

        let dataset = possibleCompanies.map((company) => {
          let filteredGenreData = selectedGenreData.filter( data => data.company === company);
          let type = companyData.filter((data) => data.company === company).reduce((a,b) => a + b.type, '');
            let genreTotal =  selectedGenreData.map((d) => d.genre).filter((v, i, arr) => arr.indexOf(v) === i).map((d) => selectedGenreData.filter((data) => data.genre == d)[0]).reduce((a,b) => a + b.genreTotal, 0);
          return {
            label: company,
            type : type == 'app' ? 'functionality' : type,
            value: (filteredGenreData.reduce((a,b) => a + b.companyCount, 0) / genreTotal)*100,
            genre: selectedGenre,
            genreIdx: idx
          } 
        });
        console.log(dataset);
        return dataset.sort((a,b) =>  b.value - a.value).map((company, idx) => {
            return {label: company.label,type: company.type, value: company.value, idx: idx, genre: company.genre, genreIdx: company.genreIdx, idName: company.label.replace(/[.\s]/g, '-')}
        }).slice(this.scrollOffset,this.scrollOffset + 10);
      
      }

      // specific genres.
      let selectedGenreData = companyGenreData.filter((companyGenre) => companyGenre.genre.replace(/_/g, ' ').toLowerCase() === selectedGenre);
      let dataset = selectedGenreData.map((data) => {
        let type = companyData.filter( company => company.company === data.company).reduce((a,b) => a+b.company,'');
        return {
          label: data.company,
          type : type == 'app' ? 'functionality' : type,
          value: data.companyPct,
          genre: selectedGenre,
            genreIdx: idx
        } 
      });
      return dataset.sort((a,b) =>  b.value - a.value).map((company, idx) => {
        return {label: company.label,type: company.type, value: company.value, idx: idx, genre: company.genre, genreIdx: company.genreIdx, idName: company.label.replace(/[.\s]/g, '-')}
      }).slice(this.scrollOffset,this.scrollOffset + 10);
    }).reduce((a,b) => a.concat(b),[]);
    

    
  }


  buildGraph(dataset) {
    var svg = d3.select(this.chart.nativeElement);
    svg.selectAll('*').remove();
    this.chartHeight = this.el.nativeElement.children[0].offsetHeight;
    this.chartWidth = this.el.nativeElement.children[0].offsetWidth;

    svg.attr('height', this.el.nativeElement.children[0].offsetHeight);
    svg.attr('width', this.el.nativeElement.children[0].offsetWidth);
    var margin = { top: 20, right: 10, bottom: 100, left: 70 };
    var width = this.chartWidth - margin.left - margin.right;
    var height = this.chartHeight - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.2),
        x1 = d3.scaleBand().padding(0.05),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

           
    x.domain(dataset.map((d) => d.label ));
    y.domain([0, 100]);

    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    svg.selectAll('g path')
      .style('stroke-width', 0)

    svg.selectAll('g.tick')
      .style('stroke-width', 1);

    g.selectAll("text")
      .attr('y', 10)
      .attr('x', 5)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(45)')
      .style('text-anchor', 'start');

    g.append('g')
        .call(d3.axisLeft(y).ticks(20).tickFormat(d => d + '%'))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Average Host Count');

    svg.append('text')             
      .attr('transform','translate(' + (width/2 + margin.left/2) + ' ,' + (height  + margin.bottom) + ')')
      .style('text-anchor', 'middle')
      .text('Company');

    svg.append('text')
      .attr('transform', 'translate(' + (margin.left / 2 ) + ' ,' + (height/2 + margin.top) + ') rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Presence in apps');

    var colour = d3.scaleOrdinal(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);
    var div = d3.select("body").append("div").attr("class", "toolTip");
    div.style('position', 'absolute')
       .style('display', 'none')
       .style('width', 'auto')
       .style('height', 'auto')
       .style('background', 'rgba(34,34,34,0.8)')
       .style('border', '0 none')
       .style('border', 'radius 8px 8px 8px 8px')
       .style('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)')
       .style('color', '#fff')
       .style('font-size', '0.75em')
       .style('padding', '5px')
       .style('text-align', 'left');

    var bars = g.selectAll('g.bar')
      .data(dataset)
      .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('id', (d)=>d.idName+d.genreIdx)
        .attr('class', (d)=>'genre'+d.genreIdx)
        .attr('x', (d) => x(d.label))
        .attr('y', (d)  => y(d.value))
        .attr('width', x.bandwidth() / this.selectedGenres.filter((val) => val != 'None').length)
        .attr('height', (d) => height - y(d.value))
        .attr('fill', (d) => colour(d.genreIdx))
        .attr('transform', (d) => 'translate(' + ((x.bandwidth()/ this.selectedGenres.filter((val) => val != 'None').length) * d.genreIdx) + ', 0)')
        .on("mousemove", (d) => {
          div.style("left", d3.event.pageX+10+"px");
          div.style("top", d3.event.pageY-25+"px");
          div.style("display", "inline-block");
          div.html( '<strong>' + d.label + '</strong> - Featured in ' + (d.value).toFixed(2).replace('.00','')+'% of '+ d.genre + ' apps.');
          bars.attr('fill', 'grey');
          svg.selectAll('.' + 'genre'+d.genreIdx).attr('fill', 'green');
        })
        .on('mouseout', (d) => {
          div.style("display", "none")
          dataset.map(element => {
            svg.selectAll('#' + element.idName+element.genreIdx).attr('fill', (element)=>colour(element.genreIdx));
          });
        });
        
    this.loadingComplete = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
      this.buildGraph(this.dataset);
  }

  private graphInit() {
    this.loadingComplete = false;
    if(!this.genreStatsSubscription.closed) {
      this.genreStatsSubscription.unsubscribe();
    }
    if(!this.companyStatsSubscription.closed) {
      this.companyStatsSubscription.unsubscribe();
    }

    this.genreStatsSubscription = this.xrayAPI.fetchCompanyGenreCoverage().subscribe((companyGenreData: CompanyGenreCoverage[]) => {
      this.companyStatsSubscription = this.xrayAPI.fetchCompanyFreq().subscribe((companyData: CompanyStats[])=> {
        this.dataset = this.buildDataset(companyGenreData, companyData);
        this.buildGraph(this.dataset);
      });
    });
  }
  
  ngOnInit(): void {
    this.graphInit(); 
    // Select the HTMl SVG Element from the template
  }

}
