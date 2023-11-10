sap.ui.define([
	"sap/m/GenericTag"
], function (GenericTag) {
	"use strict";
	return GenericTag.extend("com.Innovation.ui5Project.custom.tagnew", {
		metadata: {
		
			aggregations : {
				value : { type: 'sap.m.ObjectNumber', multiple : false, dnd : {draggable: true, droppable: true } },
		      items : {type : "sap.ui.core.Control", multiple : true, dnd : {draggable: true, droppable: true } },
		     dnd: {
				draggable: true
			}
		    }
		},
		renderer: {}
	});
});