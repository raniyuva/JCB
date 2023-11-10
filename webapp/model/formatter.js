sap.ui.define([], function() {
	"use strict";
	return {
		viewImage: function (value1) {
			return "/Attach_ImSet('" + value1 + "')/$value";
		},
        Switchclass:function(value){
			if(value === "NA"){
				return "";
			}else{
				return "Mainswitch";
			}
		},
		stringtodate:function(st){
			if( st === "" ){
                return "";
            }else{
				//  var y=st.slice(6,8) +"-"+st.slice(4,6)+"-"+st.slice(0,4);
				var y=st.slice(8, 10) + "-" + st.slice(5,7 ) + "-" + st.slice(0, 4);
			//  var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
			//  var dt = new Date(st.replace(pattern,'$3-$2-$1'));	
			// var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
    
			// return  oDateFormat.format(new Date(dt));
			return y;
			}
		},
		dateconversion: function (value) {
            if(value === null || value === "" || value === undefined){
                return "";
            }
		var	inputDate = new Date(value);
 var day = String(inputDate.getDate()).padStart(2, "0");
 var month = String(inputDate.getMonth() + 1).padStart(2, "0");
 var year = inputDate.getFullYear();
 var hours = String(inputDate.getHours()).padStart(2, "0");
 var minutes = String(inputDate.getMinutes()).padStart(2, "0");
 var seconds = String(inputDate.getSeconds()).padStart(2, "0");

 var formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

return formattedDate
		},
		formatLineItems: function(lineItemsString) {
			// Split the comma-separated string into an array
			var lineItemsArray = lineItemsString.split(',');
		
			// Create an array of items suitable for the ComboBox
			var comboBoxItems = lineItemsArray.map(function(item) {
				return new sap.ui.core.Item({ text: item });
			});
		
			return comboBoxItems;
		}

	};
});
	