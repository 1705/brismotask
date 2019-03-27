import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Rx';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

	csvContent: string;
	arrGraphData: any;
	arrGraphLabels: any;
	arrGraphPlatforms: any;
	arrGraphProductType: any;

	fileUploaded : Subject<any> = new Subject<any>();

  constructor() {
  	this.fileUploaded	
      .debounceTime(3000)
      .subscribe(
          value => {
            this.loadGraph();
      });
  }

  // ADD CHART OPTIONS. 
	chartOptions = {responsive: true}

	labels =  ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "NOV", "DEC"];
	chartData = [ {
  	      label: '1st Year',
  	      data: [21, 56, 4, 31, 45, 15, 57, 61, 9, 17, 24, 59] 
  	    },
  	    { 
  	      label: '2nd Year',
  	      data: [47, 9, 28, 54, 77, 51, 24]
  	    }];
	colors = [{ // 1st Year.
  	       backgroundColor: 'rgba(77,83,96,0.2)'
  	     },
  	     { // 2nd Year.
  	       backgroundColor: 'rgba(30, 169, 224, 0.8)'
  	     }];

	// CHART CLICK EVENT.
  onChartClick(event) {
    console.log(event);
  }

	changeGraphType(graphType) {
		console.log("------GRAPH TYPE----------");
		console.log(graphType);
	}
	
	selectPlatform(event) {
		console.log("----EVENT------");
		console.log(event);
	}
  
  ngOnInit() {
  }

  loadGraph() {

  	this.arrGraphData = localStorage.getItem('arrGraphData').split(',');
  	this.arrGraphPlatforms = localStorage.getItem('arrGraphPlatforms').split(',');
  	this.arrGraphProductType = localStorage.getItem('arrGraphProductType').split(',');
  	this.arrGraphLabels = localStorage.getItem('arrGraphLabels').split(',');
    
    // ADD CHART OPTIONS. 

  		this.labels =  this.arrGraphLabels;

  	  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  	  this.chartData = [
  	    {
  	      label: '1st Year',
  	      data: [21, 56, 4, 31, 45, 15, 57, 61, 9, 17, 24, 59] 
  	    },
  	    { 
  	      label: '2nd Year',
  	      data: [47, 9, 28, 54, 77, 51, 24]
  	    }
  	  ];

  	  // CHART COLOR.
  	   this.colors = [
  	     { // 1st Year.
  	       backgroundColor: 'rgba(77,83,96,0.2)'
  	     },
  	     { // 2nd Year.
  	       backgroundColor: 'rgba(30, 169, 224, 0.8)'
  	     }
  	   ]

  }

	onFileLoad(fileLoadedEvent) {
		const textFromFileLoaded = fileLoadedEvent.target.result;              
		this.csvContent = textFromFileLoaded;

		this.arrGraphData = [];
		this.arrGraphLabels = [];
		this.arrGraphPlatforms = [];
		this.arrGraphProductType = [];

		let allTextLines = this.csvContent.split(/\r|\n|\r/);  
		let headers = allTextLines[0].split(',');

		for (let i = 1; i < allTextLines.length; i++) {
			let data = allTextLines[i].split(',');
			if( data.length == headers.length ) {

				if( ! this.arrGraphData[data[0]] )
					this.arrGraphData[data[0]] = [];

				if( ! this.arrGraphData[data[0]][data[1]] )	
					this.arrGraphData[data[0]][data[1]] = [];
				
				this.arrGraphData[data[0]][data[1]][data[2]] = data[3];
				this.arrGraphPlatforms.push(data[0]);
				this.arrGraphProductType.push(data[1]);
				this.arrGraphLabels.push(data[2]);
			}
		}

		this.arrGraphPlatforms = this.arrGraphPlatforms.filter((v, i, a) => a.indexOf(v) === i);
		this.arrGraphProductType = this.arrGraphProductType.filter((v, i, a) => a.indexOf(v) === i);
		this.arrGraphLabels = this.arrGraphLabels.filter((v, i, a) => a.indexOf(v) === i);

		// Set CSV data to local storage
		localStorage.setItem('arrGraphData', this.arrGraphData);
		localStorage.setItem('arrGraphPlatforms', this.arrGraphPlatforms);
		localStorage.setItem('arrGraphProductType', this.arrGraphProductType);
		localStorage.setItem('arrGraphLabels', this.arrGraphLabels);

	}



	onFileSelect(input: HTMLInputElement) {

		const files = input.files;
		var content = this.csvContent;    
		if (files && files.length) {

			const fileToRead = files[0];

			const fileReader = new FileReader();
			fileReader.onload = this.onFileLoad;

			fileReader.readAsText(fileToRead, "UTF-8");
			this.fileUploaded.next();
		}

	}

}
