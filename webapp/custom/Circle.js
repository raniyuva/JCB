sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/thirdparty/d3",
	"sap/ui/core/HTML"
], function (Control,d3,HTML) {
	"use strict";
	return Control.extend("sap.ui.table.sample.Basic.circle", {
		metadata : {
			 properties : {

               id: {
        type: 'string',
        defaultValue: ""
      },
      color1:{
        type: 'string',
        defaultValue: "red"
      },
      color2:{
        type: 'string',
        defaultValue: "black"
      },
       offset1:{
        type: 'string',
        defaultValue: "100%"
      },
       offset2:{
        type: 'string',
        defaultValue: "0%"
      },
      value:{type:'string',defaultValue: "" }

       },
       aggregations:{
       	_html:{
       		type:"sap.ui.core.HTML",
       		multiple:false,
       		visibility:"hidden"
       	}
       }
		},
		
        renderer : function(oRm, oControl){
       oRm.write("<div");
        oRm.writeControlData(oControl); // writes the Control ID and enables event handling – important!
        oRm.write(">");
   
        oRm.renderControl(oControl.getAggregation("_html"));
		oRm.write("</div>");

   
       
       },
       

		onAfterRendering:function(){
			try{
		 var width = "3rem";
         var height = "49px";
         //Create SVG element
         var svg = d3.select("#"+this.getId())
            .append("svg")
            .attr("width", width)
            .attr("height", height);
           this.test=this.getId()+'--gradient';
            var gradient = svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id", this.test)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .attr("class","testing")
    .attr("spreadMethod", "pad");

    var x = this.getColor1();
    var y = this.getColor2();
    var off1=this.getOffset1();
    var off2=this.getOffset2();
gradient.append("svg:stop")
    .attr("offset",off1 )
    .attr("stop-color",x )
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", off2)
    .attr("stop-color", y)
    .attr("stop-opacity", 1);
         //Append circle url(#gradient)
         svg.append("circle")
            .attr("cx", 12)
            .attr("cy", 20)
            .attr("r", 12)
            .attr("class","test")
            .attr('fill', 'url(#'+this.test+')');
             
             
            svg.append("circle")
            .attr("cx", 12)
            .attr("cy", 20)
            .attr("r", 8)
            .attr('fill','black');
           
              svg.append("text")
         .attr("x",9)
         .attr("y",23)
         .attr("font-size", "8px")
         .attr("stroke", "yellow")
         .attr("font-family", "sans-serif").text( this.getValue());
         svg={};
}
catch{
	console.log("test");
}
		},
	
		getValue: function() {
			return this.getProperty("value");
		},



		setValue:function(sValue){
			this.setProperty("value",sValue , true);

	
	
			return this;	
		},
			getOffset1: function() {
			return this.getProperty("offset1");
		},
		setOffset1:function(sValue1){
			this.setProperty("offset1",sValue1 , true);
			
			return this;	
		},
			getOffset2: function() {
			return this.getProperty("offset2");
		},
		setOffset2:function(sValue2){
			this.setProperty("offset2",sValue2 , true);
			
			return this;	
		},
			getColor1: function() {
			return this.getProperty("color1");
		},
		setColor1:function(sValue3){
			this.setProperty("color1",sValue3 , true);
			
			return this;	
		},
			getColor2: function() {
			return this.getProperty("color2");
		},
		setColor2:function(sValue4){
			this.setProperty("color2",sValue4 , true);
			
			return this;	
		}
	
	});
});