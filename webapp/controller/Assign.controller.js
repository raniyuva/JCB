sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'sap/ui/core/Fragment',
	"comZJCB/model/formatter"
], function (Controller, MessageToast, JSONModel, Fragment, formatter) {

	"use strict";
	var countflag = false;
	this.Reassigndata = [];
	var reassignselectedtech = "";
	return Controller.extend("comZJCB.controller.Assign", {
		formatter: formatter,
		filterColumn: function (oeve) {
			console.log(oeve);
		},
		// _getFormFragment: function (sFragmentName) {
		// 		var pFormFragment = this._formFragments[sFragmentName],
		// 			oView = this.getView();

		// 		if (!pFormFragment) {
		// 			pFormFragment = Fragment.load({

		// 				name: "comZJCB.fragment." + sFragmentName
		// 			});
		// 			this._formFragments[sFragmentName] = pFormFragment;
		// 		}

		// 		return pFormFragment;
		// 	},

		// 	_showFormFragment : function (sFragmentName) {
		// 		var oPage = this.byId("page");
		// 		this._getFormFragment(sFragmentName).then(function(oVBox){
		// 			oPage.addContent(oVBox);
		// 		});
		// 	},
		onSelectButton: function (oeve) {
			this.segselect = oeve.getSource().getSelectedKey();

			var oPage = this.byId("page");
			var pFormFragment;
			var that = this;
			if (oeve.getSource().getSelectedKey() === "BAYWISE") {
				this.getView().byId("PC2").setVisible(true);
				this.getView().byId("PC1").setVisible(false);
				this.getView().byId("PC3").setVisible(false);
				this.getView().byId("PC4").setVisible(false);
				this.getView().byId("PCTable").setVisible(false);
				// this.getView().byId("vehlegend").setVisible(false);
				this.getView().byId("caltabicon").setVisible(false);
				this._ReadCalendermodel();
				/*	this.getView().byId("idCalnav").setVisible(false);
						this.getView().byId("idTablenav").setVisible(false);*/

			} else if (oeve.getSource().getSelectedKey() === "TechWise") {
				this.getView().byId("PC2").setVisible(false);
				this.getView().byId("PC1").setVisible(true);
				this.getView().byId("PC3").setVisible(false);
				this.getView().byId("PC4").setVisible(false);
				this.getView().byId("PCTable").setVisible(false);
				// this.getView().byId("vehlegend").setVisible(false);
				this.getView().byId("caltabicon").setVisible(false);
				/*	this.getView().byId("idCalnav").setVisible(false);
						this.getView().byId("idTablenav").setVisible(false);*/
				this._ReadTechCalendarmodel("All");

			} else if (oeve.getSource().getSelectedKey() === "InspectorWise") {
				this.getView().byId("PC2").setVisible(false);
				this.getView().byId("PC1").setVisible(false);
				this.getView().byId("PC3").setVisible(true);
				this.getView().byId("PC4").setVisible(false);
				this.getView().byId("PCTable").setVisible(false);
				// this.getView().byId("vehlegend").setVisible(false);
				this.getView().byId("caltabicon").setVisible(false);
				/*this.getView().byId("idCalnav").setVisible(false);
					this.getView().byId("idTablenav").setVisible(false);*/
				this._ReadInspectCalendarmodel("All");
			} else if (oeve.getSource().getSelectedKey() === "Veh") {
				this.getView().byId("PC2").setVisible(false);
				this.getView().byId("PC1").setVisible(false);
				this.getView().byId("PC3").setVisible(false);
				this.getView().byId("PC4").setVisible(true);
				this.getView().byId("caltabicon").setSelectedKey("Calnav");

				// this.getView().byId("PCTable").setVisible(true);

				this.getView().byId("caltabicon").setVisible(true);
				//	this.getView().byId("idTablenav").setVisible(true);
				this._ReadVehCal();
				this._ReadVehTable();
			}
		},
		onSelecticon: function (oeve) {
			if (oeve.getParameters().key === "Calnav") {
				this.getView().byId("PC4").setVisible(true);
				this.getView().byId("PCTable").setVisible(false);
				// this.getView().byId("vehlegend").setVisible(false);	
			} else if (oeve.getParameters().key === "Tablenav") {
				this.getView().byId("PC4").setVisible(false);
				this.getView().byId("PCTable").setVisible(true);
				// this.getView().byId("vehlegend").setVisible(true);	
			}
		},
		/*	ShowCal:function(){
				this.getView().byId("PC4").setVisible(true);
				this.getView().byId("PCTable").setVisible(false);
			},
			ShowTable:function(){
				
				this.getView().byId("PC4").setVisible(false);
				this.getView().byId("PCTable").setVisible(true);
			},*/
		_ReadMainTechdrpmodle: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessmaintech = function (oData) {
				that.oBusyDialog.close();
				// oData.results.unshift({})
				if (oData.results.length > 1) {
					oData.results.unshift({ EmpNo: "", EmpName: "" });
				}

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/MainTechnicianSetmodel", oData.results);


			};
			var oErrormaintech = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/MainTechnicianListSet", {
				success: oSuccessmaintech,
				error: oErrormaintech
			});
		},
		_ReadReassignReasondrpmodle: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessReassignReason = function (oData) {
				that.oBusyDialog.close();
				oData.results.unshift({ "Input": "", "Reason1": "" });
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ReassignReasonSetmodel", oData.results);


			};
			var oErrorReassignReason = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ, 'TECH_REASON'));

			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/ReasonSet", {
				filters: sFilters,
				success: oSuccessReassignReason,
				error: oErrorReassignReason
			});
		},
		_ReadBaydrpmodel: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessBaydet = function (oData) {
				that.oBusyDialog.close();
				oData.results.unshift({ "BayName": "", "BayCat": "" });
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/BayDetailsSetModel", oData.results);


			};
			var oErrorBaydet = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/BayDetailsSet", {
				success: oSuccessBaydet,
				error: oErrorBaydet
			});
		},
		_ReadHolddrpmodel: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessHold = function (oData) {
				that.oBusyDialog.close();
				oData.results.unshift({ "Hold_reason": "" });
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/HoldModel", oData.results);


			};
			var oErrorHold = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/OnHoldDetailsSet", {
				success: oSuccessHold,
				error: oErrorHold
			});
		},
		_ReadDelaydrpmodel: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessDelay = function (oData) {
				that.oBusyDialog.close();
				oData.results.unshift({ "Delay_reason": "" });
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/DelayModel", oData.results);


			};
			var oErrorDelay = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/OnDelayDetailsSet", {
				success: oSuccessDelay,
				error: oErrorDelay
			});
		},
		_ReadBayStatusdrpmodel: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessBaystat = function (oData) {
				that.oBusyDialog.close();
				oData.results.unshift({ "Bay_Status": "" });
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/BaystatModel", oData.results);


			};
			var oErrorBaystat = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/OnBayStatusSet", {
				success: oSuccessBaystat,
				error: oErrorBaystat
			});
		},
		_Readforemandrpmodel: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessForeman = function (oData) {
				that.oBusyDialog.close();
				if (oData.results.length > 1) {
					oData.results.unshift({ EmpNo: "", EmpName: "" });
				}

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ForemanSetmodel", oData.results);


			};
			var oErrorForeman = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/ForemanSet", {
				success: oSuccessForeman,
				error: oErrorForeman
			});
		},
		_ReadCalendermodel: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessCalend = function (oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarModel", oData.results);
				var today = new Date();
				today.setHours(8, 0, 0, 0);
				var Tobe_Attended_Count = 0, Not_Attended_Count = 0, Qi_Count = 0, Wip_Count = 0, Vehicle_Ready_Count = 0, Vehicle_Unass_Count = 0, Washing_Job_Count = 0;
				for (var i = 0; i < oData.results.length; i++) {

					Tobe_Attended_Count = Tobe_Attended_Count + parseInt(oData.results[i].Tobe_Attended_Count);
					Not_Attended_Count = Not_Attended_Count + parseInt(oData.results[i].Not_Attended_Count);
					Qi_Count = Qi_Count + parseInt(oData.results[i].Qi_Count);
					Wip_Count = Wip_Count + parseInt(oData.results[i].Wip_Count);
					Vehicle_Ready_Count = Vehicle_Ready_Count + parseInt(oData.results[i].Vehicle_Ready_Count);
					Vehicle_Unass_Count = Vehicle_Unass_Count + parseInt(oData.results[i].Vehicle_Unass_Count);
					Washing_Job_Count = Washing_Job_Count + parseInt(oData.results[i].Washing_Job_Count);

				}
				var baycountdata = {
					Tobe_Attended_Count: Tobe_Attended_Count,
					Not_Attended_Count: Not_Attended_Count,
					Qi_Count: Qi_Count,
					Wip_Count: Wip_Count,
					Vehicle_Ready_Count: Vehicle_Ready_Count,
					Vehicle_Unass_Count: Vehicle_Unass_Count,
					Washing_Job_Count: Washing_Job_Count
				}
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/Baycountset", baycountdata);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/startdatePC", today);
				// $("#"+that.Custfilterid).addClass("Shadowfilterclass");
				// $("#" + that.statusfilterid).addClass("Shadowfilterclass");
				// $("#"+that.bookngtypfilterid).addClass("Shadowfilterclass");
				// $("#"+that.jobdayfilerid).addClass("Shadowfilterclass");
				//  $("#"+that.jobstatusfilterid).addClass("Shadowfilterclass");
			};
			var oErrorCalend = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			// var sFilters = [];
			// sFilters.push(new sap.ui.model.Filter("Cust_Priority", sap.ui.model.FilterOperator.EQ,that.Cust_Priority ));
			// sFilters.push(new sap.ui.model.Filter("Booking_Type", sap.ui.model.FilterOperator.EQ, that.Booking_Type));
			// sFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ,that.Status));
			// sFilters.push(new sap.ui.model.Filter("Job_Day", sap.ui.model.FilterOperator.EQ,that.Job_Day));
			// sFilters.push(new sap.ui.model.Filter("Job_Status", sap.ui.model.FilterOperator.EQ,that.Job_Status ));

			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/BayDetailsSet", {
				// filters: sFilters,
				urlParameters: {
					"$expand": "BAYWISE"
				},
				success: oSuccessCalend,
				error: oErrorCalend
			});
		},
		
		_ReadTechCalendarmodel: function (value) {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessTechCalend = function (oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarTechModel", oData.results);


			};
			var oErrorTechCalend = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ, value));

			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/TechnicianDetailsSet", {
				filters: sFilters,
				urlParameters: {
					"$expand": "TechWise"
				},
				success: oSuccessTechCalend,
				error: oErrorTechCalend
			});
		},
		_ReadInspectCalendarmodel: function (value) {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessInspectCalend = function (oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarInspModel", oData.results);


			};
			var oErrorInspectCalend = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ, value));

			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/InspectorDetailsSet", {
				filters: sFilters,
				urlParameters: {
					"$expand": "InspectorWise"
				},
				success: oSuccessInspectCalend,
				error: oErrorInspectCalend
			});
		},
		// 	_ReadInspectCalendarmodel:function(){
		// 		var that=this;
		// 		that.oBusyDialog.open();
		// 		var oSuccessInspectFilter = function(oData) {
		// 			that.oBusyDialog.close();

		// 			that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarInspModel", oData.results);


		// 		};
		// 		var oErrorInspectFilter = function(err) {
		// 			that.oBusyDialog.close();

		// 			sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
		// 		};
		// 			var sFilters = [];
		// 			sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ,value));

		// 		that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/InspectorDetailsSet", {
		// 			filters:sFilters,
		// 			urlParameters: {
		// 				"$expand": "InspectorWise"
		// 			},
		// 			success: oSuccessInspectFilter,
		// 			error: oErrorInspectFilter
		// 		});
		// },
		_ReadFloverSupervisorlist: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessFlrsu = function (oData) {
				that.oBusyDialog.close();
				if (oData.results.length > 1) {
					oData.results.unshift({ EmpNo: "", EmpName: "" });
				}

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/floorsuperModel", oData.results);


			};
			var oErrorFlrsu = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/FloorSupervisorSet", {
				success: oSuccessFlrsu,
				error: oErrorFlrsu
			});
		},
		_ReadHaedrandtobeassigned: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessHeadTBA = function (oData) {
				that.oBusyDialog.close();
				that.getOwnerComponent().getModel("oLocalJsonModel").setSizeLimit(1000);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/CountDataset", oData);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignedToDataSet", oData.TBA_Call.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/HoldSubletdata", oData.JCBHOLDSU_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/HoldPartsdata", oData.JCBHOLDPA_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/Holdothersdata", oData.JCBHOLDOT_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/MainSubletdata", oData.JCBSUBLET_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/MainRoadtestdata", oData.JCBROADTEST_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignedToDataSetCount", oData.TBA_Call.results.length);


			};
			var oErrorHeadTBA = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.error(err.message);
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/HeaderInfoSet('')", {
				urlParameters: {
					"$expand": "TBA_Call,JCBHOLDSU_NAV,JCBHOLDPA_NAV,JCBHOLDOT_NAV,JCBSUBLET_NAV,JCBROADTEST_NAV"
				},
				success: oSuccessHeadTBA,
				error: oErrorHeadTBA
			});
		},
		_ReadVehCal: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessVehCalend = function (oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarVehModel", oData.results);


			};
			var oErrorVehCalend = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/Service_DB_HeaderSet", {
				urlParameters: {
					"$expand": "Servicehdrtoitm"
				},
				success: oSuccessVehCalend,
				error: oErrorVehCalend
			});
		},
		_ReadVehTable: function () {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessVehTable = function (oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/VehTableset", oData.results);


			};
			var oErrorVehTable = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ, ""));
			// sFilters.push(new sap.ui.model.Filter("Aggregate", sap.ui.model.FilterOperator.EQ, "IN"));
			// that.getOwnerComponent().getModel("ZJOB_CARD_SRV").read("/Ass_Veh_ListSet", {
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/VehicledetailsSet", {
				filters: sFilters,
				success: oSuccessVehTable,
				error: oErrorVehTable
			});
		},
		_showPopoverHoldPA: function (oeve) {
			this._timeId = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var pathHoldPA = oeve.srcControl.sId.split("idHoldPA-")[1];

				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['HoldPartsdata'][pathHoldPA];
				var popmodel = new JSONModel(datapop);
				this.byId("popoverHoldPA").setModel(popmodel, "PopoverModelHoldPA");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popoverHoldPA").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopoverHoldPA: function (oeve) {
			clearTimeout(this._timeId);
			this.byId("popoverHoldPA").close();
		},
		_showPopoverHoldSU: function (oeve) {
			this._timeId = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var pathHoldPA = oeve.srcControl.sId.split("idHoldSU-")[1];

				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['HoldSubletdata'][pathHoldPA];
				var popmodel = new JSONModel(datapop);
				this.byId("popoverHoldSU").setModel(popmodel, "PopoverModelHoldSU");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popoverHoldSU").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopoverHoldSU: function (oeve) {
			clearTimeout(this._timeId);
			this.byId("popoverHoldSU").close();
		},
		_showPopoverHoldOT: function (oeve) {
			this._timeId = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var pathHoldPA = oeve.srcControl.sId.split("idHoldOT-")[1];

				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['Holdothersdata'][pathHoldPA];
				var popmodel = new JSONModel(datapop);
				this.byId("popoverHoldOT").setModel(popmodel, "PopoverModelHoldOT");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popoverHoldOT").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopoverHoldOT: function (oeve) {
			clearTimeout(this._timeId);
			this.byId("popoverHoldOT").close();
		},
		_showPopoverMainSU: function (oeve) {
			this._timeId = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var pathMainSU = oeve.srcControl.sId.split("idMainSU-")[1];

				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['MainSubletdata'][pathMainSU];
				var popmodel = new JSONModel(datapop);
				this.byId("popoverMainSU").setModel(popmodel, "PopoverModelMainSU");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popoverMainSU").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopoverMainSU: function (oeve) {
			clearTimeout(this._timeId);
			this.byId("popoverMainSU").close();
		},
		_showPopoverMainRT: function (oeve) {
			this._timeId = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var pathMainRT = oeve.srcControl.sId.split("idMainRT-")[1];

				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['MainRoadtestdata'][pathMainRT];
				var popmodel = new JSONModel(datapop);
				this.byId("popoverMainRT").setModel(popmodel, "PopoverModelMainRT");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popoverMainRT").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopoverMainRT: function (oeve) {
			clearTimeout(this._timeId);
			this.byId("popoverMainRT").close();
		},
		_showPopoverTBA: function (oeve) {
			this._timeId = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var pathTBA = oeve.srcControl.sId.split("idTBAs-")[1];

				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['AssignedToDataSet'][pathTBA];
				var popmodel = new JSONModel(datapop);
				this.byId("popoverTBA").setModel(popmodel, "PopoverModelTBA");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popoverTBA").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopoverTBA: function (oeve) {
			clearTimeout(this._timeId);
			this.byId("popoverTBA").close();
		},
		_showPopover: function (oeve) {
			this._timeId = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var path = oeve.srcControl.sId.split("-")[7];
				var path1 = oeve.srcControl.sId.split("-")[8];
				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['calendarModel'][path][this.segselect].results[path1];
				var popmodel = new JSONModel(datapop);
				this.byId("popover").setModel(popmodel, "PopoverModel");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popover").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopover: function (oeve) {
			clearTimeout(this._timeId);
			this.byId("popover").close();
		},
		_showPopover1: function (oeve) {
			this._timeId1 = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var path = oeve.srcControl.sId.split("-")[7];
				var path1 = oeve.srcControl.sId.split("-")[8];
				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['calendarTechModel'][path][this.segselect].results[path1];
				var popmodel = new JSONModel(datapop);
				this.byId("popover1").setModel(popmodel, "PopoverModel1");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popover1").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopover1: function (oeve) {
			clearTimeout(this._timeId1);
			this.byId("popover1").close();
		},
		_showPopover2: function (oeve) {
			this._timeId3 = setTimeout(() => {
				// var path=oeve.relatedTarget.id.split("AppsInt")[1]
				// var path2 =oeve.relatedTarget.id.substring(oeve.relatedTarget.id.indexOf("PC2")+4,oeve.relatedTarget.id.indexOf("-CalRow"));
				var path = oeve.srcControl.sId.split("-")[7];
				var path1 = oeve.srcControl.sId.split("-")[8];
				var datapop = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['calendarInspModel'][path][this.segselect].results[path1];
				var popmodel = new JSONModel(datapop);
				this.byId("popover3").setModel(popmodel, "PopoverModel3");
				//  this.byId("popover").openBy(this.byId("Idappt"));
				this.byId("popover3").openBy(oeve.relatedTarget);
			}, 500);
		},

		_clearPopover2: function (oeve) {
			clearTimeout(this._timeId3);
			this.byId("popover3").close();
		},
		onAsschange: function () {
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
		},
		onInit: function () {
			this.oBusyDialog = new sap.m.BusyDialog();

			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/NavButtons", false);
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", false);
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/holdactionenableflag", false);

			this.segselect = "BAYWISE";
			var that = this;
			this.Cust_Priority = "", this.Booking_Type = "", this.Status = "", this.Job_Day = "", this.Job_Status = "", this.Vehicle_Unassign = "";
			var datacalTBA = { "keyid": "PC2-Tabl" };
			that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/datacalTablemodel", datacalTBA);
			that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/POfield", false);
			that.byId("Idappt").addEventDelegate({
				onmouseover: this._showPopover,
				onmouseout: this._clearPopover,
			}, this);
			that.byId("Idappt1").addEventDelegate({
				onmouseover: this._showPopover1,
				onmouseout: this._clearPopover1,
			}, this);
			that.byId("Idappt3").addEventDelegate({
				onmouseover: this._showPopover2,
				onmouseout: this._clearPopover2,
			}, this);
			that.byId("idTBAtag").addEventDelegate({
				onmouseover: this._showPopoverTBA,
				onmouseout: this._clearPopoverTBA,
			}, this);
			that.byId("idHoldPAtag").addEventDelegate({
				onmouseover: this._showPopoverHoldPA,
				onmouseout: this._clearPopoverHoldPA,
			}, this);
			that.byId("idHoldSUtag").addEventDelegate({
				onmouseover: this._showPopoverHoldSU,
				onmouseout: this._clearPopoverHoldSU,
			}, this);
			that.byId("idHoldOTtag").addEventDelegate({
				onmouseover: this._showPopoverHoldOT,
				onmouseout: this._clearPopoverHoldOT,
			}, this);
			that.byId("idMainSUtag").addEventDelegate({
				onmouseover: this._showPopoverMainSU,
				onmouseout: this._clearPopoverMainSU,
			}, this);
			that.byId("idMainRTtag").addEventDelegate({
				onmouseover: this._showPopoverMainRT,
				onmouseout: this._clearPopoverMainRT
			}, this);
			that._ReadBaydrpmodel();
			that._ReadMainTechdrpmodle();
			that._Readforemandrpmodel();
			that._ReadCalendermodel();
			that._ReadFloverSupervisorlist();
			that._ReadHaedrandtobeassigned();
			//   that._ReadInspectCalendarmodel("All");
			//   that._ReadTechCalendarmodel("All");
			//   that._ReadVehTable();
			//   that._ReadVehCal();
			that._ReadDelaydrpmodel();
			that._ReadHolddrpmodel();
			that._ReadBayStatusdrpmodel();
			that._ReadQICount();
			that._Readinvocecount();
			that.segselect = "BAYWISE";
			/*that.oBusyDialog.open();
			var oSuccess = function(oData) {
				that.oBusyDialog.close();
				var oModel = new JSONModel(oData);
				that.getView().setModel(oModel, "CountDataset");
			};
			var oError = function(err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
			};

			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/CountSet('sa')", {
				success: oSuccess,
				error: oError
			});
			var oSuccessReason = function(oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ReasonListSet", oData.results);
			};
			var oErrorReason = function(err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
			};
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ, "Reasons"));
			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/Search_HelpSet", {
				filters: sFilters,
				success: oSuccessReason,
				error: oErrorReason
			});
			var oSuccessSA = function(oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/SAListSet", oData.results);
			};
			var oErrorSA = function(err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
			};
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ, "SA"));
			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/Search_HelpSet", {
				filters: sFilters,
				success: oSuccessSA,
				error: oErrorSA
			});
			var oSuccessAssignedto = function(oData) {
				that.oBusyDialog.close();
				
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignedToDataSetCount", oData.results.length);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignedToDataSet", oData.results);

			
			};
			var oErrorAssignedTo = function(err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
			};

			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/To_Be_AssignedSet", {

				success: oSuccessAssignedto,
				error: oErrorAssignedTo
			});
			
			var oSuccessCalend = function(oData) {
				that.oBusyDialog.close();
			
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarModel", oData.results);
				var today = new Date();
				today.setHours(8,0,0,0);
				
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/startdatePC",today);
			
			};
			var oErrorCalend = function(err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/SA_HdrSet", {
				urlParameters: {
					"$expand": "SA_CAL"
				},
				success: oSuccessCalend,
				error: oErrorCalend
			});
			var oSuccessTodaySch = function(oData) {
				that.oBusyDialog.close();
				that.oModelTodaySch = new JSONModel(oData.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/TodayScheduleData", oData.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/TodayScheduleDatalength", oData.results.length);
				//that.getView().setModel(oModelAssignedto, "AssignedToDataSet");
			};
			var oErrorTodaySch = function(err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
			};

			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/Today_ScheduleSet", {

				success: oSuccessTodaySch,
				error: oErrorTodaySch
			});*/



		},
		onTableLegendpress: function (oeve) {
			console.log(oeve.getSource().getText());
		},

		handleHoldData: function (oeve) {
			var that = this;
			var selecteddata = that.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'];
			if (selecteddata.Bay_Status === "") {
				sap.ui.getCore().byId("Baystat").setValueState(sap.ui.core.ValueState.Error);
				return;
			} else {
				sap.ui.getCore().byId("Baystat").setValueState(sap.ui.core.ValueState.None);
			}
			if (selecteddata.Hold_reason === "") {
				sap.ui.getCore().byId("Holdreason").setValueState(sap.ui.core.ValueState.Error);
				return;
			} else {
				sap.ui.getCore().byId("Holdreason").setValueState(sap.ui.core.ValueState.None);
			}
			if (selecteddata.Delay_reason === "") {
				sap.ui.getCore().byId("Delayreason").setValueState(sap.ui.core.ValueState.Error);
				return;
			} else {
				sap.ui.getCore().byId("Delayreason").setValueState(sap.ui.core.ValueState.None);
			}
			if (selecteddata.Hold_reason === "PARTS NOT AVAILABLE") {
				if (selecteddata.PO === "") {
					sap.ui.getCore().byId("pofield").setValueState(sap.ui.core.ValueState.Error);
					return;
				} else {
					sap.ui.getCore().byId("pofield").setValueState(sap.ui.core.ValueState.None);
				}
			}
			selecteddata.Input = "HOLD"
			// selecteddata.Start_Timestamp = new Date(sap.ui.getCore().byId("PlanStartDate").getValue());
			// selecteddata.End_Timestamp = new Date(sap.ui.getCore().byId("promisedDeliveryDate").getValue());
			selecteddata.Start_Timestamp = sap.ui.getCore().byId("PlanStartDate").getDateValue();
			selecteddata.End_Timestamp = sap.ui.getCore().byId("promisedDeliveryDate").getDateValue();

			// that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]][this.segselect]['results'][that.Appselect[5]]=selecteddata;
			// var data=that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]];

			that.oBusyDialog.open();
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/ToBeAssignedSet", selecteddata, {
				success: function (oEvent) {
					that.oBusyDialog.close();
					that._ReadCalendermodel();
					that._ReadHaedrandtobeassigned();
					that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
					that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
					// sap.m.MessageBox.show("Calendar Updated Sucussfully");
					sap.m.MessageBox.success(oEvent.Msg);
				},
				error: function (err) {
					that.oBusyDialog.close();

					that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]][this.segselect]['results'][that.Appselect[5]] = that.getOwnerComponent().getModel("oLocalJsonModel").getData()['ResetDataPopup'];
					sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
				}
			});

			this._ValueUnAssignROJCB.close();
		},
		handleAssignData: function (oeve) {
			var that = this;
			var selecteddata = that.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'];
			selecteddata.Input = "ASSIGN"
			// selecteddata.Start_Timestamp = new Date(sap.ui.getCore().byId("PlanStartDate").getValue());
			// selecteddata.End_Timestamp = new Date(sap.ui.getCore().byId("promisedDeliveryDate").getValue());
			selecteddata.Start_Timestamp = sap.ui.getCore().byId("PlanStartDate").getDateValue();
			selecteddata.End_Timestamp = sap.ui.getCore().byId("promisedDeliveryDate").getDateValue();
			
			if(sap.ui.getCore().byId("Maintech").getSelectedKey() === ""){
				sap.m.MessageBox.show("Please maintain Main Technician ", sap.m.MessageBox.Icon.ERROR, "Error");
				return;
			}
			// that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]][this.segselect]['results'][that.Appselect[5]]=selecteddata;
			// var data=that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]];

			that.oBusyDialog.open();
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/ToBeAssignedSet", selecteddata, {
				success: function (oEvent) {
					that.oBusyDialog.close();
					that._ReadCalendermodel();
					that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
					that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
					// sap.m.MessageBox.show("Calendar Updated Sucussfully");
					sap.m.MessageBox.success(oEvent.Msg);
				},
				error: function (err) {
					that.oBusyDialog.close();

					that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]][this.segselect]['results'][that.Appselect[5]] = that.getOwnerComponent().getModel("oLocalJsonModel").getData()['ResetDataPopup'];
					sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
				}
			});

			this._ValueUnAssignROJCB.close();
			if(this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/InfoMessage") && this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/InfoMessage").length > 1){

				var infomsg = this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/InfoMessage");
				sap.m.MessageBox.show(infomsg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION");
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/InfoMessage", "");
			}

		},
		handleUnAssignData: function (oeve) {
			var that = this;
			var selecteddata = that.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'];
			selecteddata.Input = "UNASSIGN"
			// selecteddata.Start_Timestamp = new Date(sap.ui.getCore().byId("PlanStartDate").getValue());
			// selecteddata.End_Timestamp = new Date(sap.ui.getCore().byId("promisedDeliveryDate").getValue());
			// that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]][this.segselect]['results'][that.Appselect[5]]=selecteddata;
			// var data=that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]];

			that.oBusyDialog.open();
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/ToBeAssignedSet", selecteddata, {
				success: function (oEvent) {
					that.oBusyDialog.close();
					that._ReadCalendermodel();
					that._ReadHaedrandtobeassigned();
					that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
					that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
					// sap.m.MessageBox.show("Unassigned Sucussfully");
					sap.m.MessageBox.success(oEvent.Msg);
					if(that.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/InfoMessage") && that.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/InfoMessage").length > 1){

						that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/InfoMessage", "");
					}
				},
				error: function (err) {
					that.oBusyDialog.close();

					that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]][this.segselect]['results'][that.Appselect[5]] = that.getOwnerComponent().getModel("oLocalJsonModel").getData()['ResetDataPopup'];
					sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
				}
			});

			this._ValueUnAssignROJCB.close();
		},
		onListPlanningCalendarDrop: function (oEvent) {
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			this.rownum = rowId.charAt(rowId. length-1);
			var pcRow = sap.ui.getCore().byId(rowId);
			var oBindingContext = pcRow.getBindingContext("oLocalJsonModel");
			var resourceObj = oBindingContext.getObject();

			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");
			var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.id.split('AppsInt')[1]);
			//	var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
			if (isNaN(dropappstartposition)) {
				// dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
				dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.parentElement.id.split('AppsInt')[1]);
			}
			// new logic for exact timestamp
			var offset = oEvent.getParameters().browserEvent.offsetX / 10;
			var offsetmins = offset * 7.5;
			// new logic for exact timestamp
			var dropappendposition = dropappstartposition + 0.50;
			var dropaptstartdate = this.getView().byId("PC2").getStartDate().getTime() + dropappstartposition * 60 * 60 * 1000;
			var dropaptenddate = this.getView().byId("PC2").getStartDate().getTime() + dropappendposition * 60 * 60 * 1000;
			var path = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").sPath.split('/');
			var draggeddata = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").getModel().getData()[path[1]][path[2]];
			// new logic for exact start timestamp
			var startdate = new Date(dropaptstartdate)
			startdate.setMinutes(startdate.getMinutes() + offsetmins);
			draggeddata.Start_Timestamp = new Date(startdate);
			var enddate = new Date(dropaptenddate)
			enddate.setMinutes(enddate.getMinutes() + offsetmins);
			draggeddata.End_Timestamp = new Date(enddate);
			// new logic for exact start timestamp
			// old logic commented
			// draggeddata.Start_Timestamp=new Date(dropaptstartdate);
			// draggeddata.End_Timestamp=new Date(dropaptenddate);
			// old logic commented
			//  if(new Date(dropaptstartdate) >= new Date() ){
			if (new Date(startdate) >= new Date()) {
				draggeddata.Input = "ASSIGN";
				var entiypath;
				// if(this.segselect === "BAYWISE"){
				draggeddata.BayCategory = resourceObj.BayCat;
				draggeddata.BayName = resourceObj.BayName;
				entiypath = "/BayDetailsSet";
				// }else if(this.segselect === "TechWise"){
				// draggeddata.Technicion_Name=resourceObj.EMP_Name;
				// draggeddata.Technicion_No=resourceObj.EMP_NO;
				// entiypath="/TechnicianDetailsSet";
				// }else if(this.segselect === "InspectorWise"){
				// draggeddata.FloorSupervisor_No=resourceObj.EMP_NO;
				// draggeddata.FloorSupervisor_Name=resourceObj.EMP_Name;
				// entiypath="/InspectorDetailsSet";
				// }

				var odatEve = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel");
				var that = this;
				resourceObj[this.segselect].results.push(draggeddata);

				that.oBusyDialog.open();
				that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create(entiypath, resourceObj, {
					success: function (oEvent) {
						that.oBusyDialog.close();
						/*	resourceObj.SA_CAL.results.push(draggeddata);*/

						//	odatEve.getModel().getData()[path[1]].splice(path, 1);
						that._ReadCalendermodel();
						that._ReadHaedrandtobeassigned();
						that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
						if (oEvent.Flag === "E") {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.ERROR, "Error");
						} else {
							if (oEvent.Msg.search("assigned") !== -1) {
								oEvent.Msg = oEvent.Msg.split("to the ");
								oEvent.Msg = oEvent.Msg[0] + " " + oEvent.BayCat;//+ " " + e.Msg[1];

							}
							var PC2appointments = that.getView().byId("PC2").getRows()[that.rownum].getAppointments();
							var oCurrentAppointment = PC2appointments[PC2appointments.length -1];
							that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/InfoMessage", oEvent.Msg);
							that._autoOpenAppointmentDialog(oCurrentAppointment);
							
						}
					},
					error: function (err) {
						that.oBusyDialog.close();
						resourceObj[that.segselect].results.pop();

						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					}
				});


			} else {
				sap.m.MessageBox.show("Cannot assign Vehicle to past time", sap.m.MessageBox.Icon.ERROR, "Error");
			}

		},
		onListPlanningCalendarDropholdpa: function (oEvent) {
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			var pcRow = sap.ui.getCore().byId(rowId);
			var oBindingContext = pcRow.getBindingContext("oLocalJsonModel");
			var resourceObj = oBindingContext.getObject();
			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");
			var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.id.split('AppsInt')[1]);
			//	var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
			if (isNaN(dropappstartposition)) {
				// dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
				dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.parentElement.id.split('AppsInt')[1]);
			}
			// new logic for exact timestamp
			var offset = oEvent.getParameters().browserEvent.offsetX / 10;
			var offsetmins = offset * 7.5;
			// new logic for exact timestamp
			var dropappendposition = dropappstartposition + 0.50;
			var dropaptstartdate = this.getView().byId("PC2").getStartDate().getTime() + dropappstartposition * 60 * 60 * 1000;
			var dropaptenddate = this.getView().byId("PC2").getStartDate().getTime() + dropappendposition * 60 * 60 * 1000;
			var path = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").sPath.split('/');
			var draggeddata = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").getModel().getData()[path[1]][path[2]];
			delete draggeddata.__metadata;
			// new logic for exact start timestamp
			var startdate = new Date(dropaptstartdate)
			startdate.setMinutes(startdate.getMinutes() + offsetmins);
			draggeddata.Start_Timestamp = new Date(startdate);
			var enddate = new Date(dropaptenddate)
			enddate.setMinutes(enddate.getMinutes() + offsetmins);
			draggeddata.End_Timestamp = new Date(enddate);
			// new logic for exact start timestamp
			// old logic commented
			// draggeddata.Start_Timestamp=new Date(dropaptstartdate);
			// draggeddata.End_Timestamp=new Date(dropaptenddate);
			// old logic commented
			//  if(new Date(dropaptstartdate) >= new Date() ){
			if (new Date(startdate) >= new Date()) {
				draggeddata.Input = "ASSIGNHOLDPART";
				var entiypath;
				// if(this.segselect === "BAYWISE"){
				draggeddata.BayCategory = resourceObj.BayCat;
				draggeddata.BayName = resourceObj.BayName;
				entiypath = "/BayDetailsSet";
				// }else if(this.segselect === "TechWise"){
				// draggeddata.Technicion_Name=resourceObj.EMP_Name;
				// draggeddata.Technicion_No=resourceObj.EMP_NO;
				// entiypath="/TechnicianDetailsSet";
				// }else if(this.segselect === "InspectorWise"){
				// draggeddata.FloorSupervisor_No=resourceObj.EMP_NO;
				// draggeddata.FloorSupervisor_Name=resourceObj.EMP_Name;
				// entiypath="/InspectorDetailsSet";
				// }

				var odatEve = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel");
				var that = this;

				// delete resourceObj[0].ADD_TAB;
				var dataHold = {
					"BayName": resourceObj.BayName,
					"BayCat": resourceObj.BayCat,
					"BayCount": resourceObj.BayCount,
					"BayStatus": resourceObj.BayStatus,
					"Cust_Priority": resourceObj.Cust_Priority,
					"Booking_Type": resourceObj.Booking_Type,
					"Status": resourceObj.Status,
					"Job_Day": resourceObj.Job_Day,
					"Msg": resourceObj.Msg,
					"Flag": resourceObj.Flag,
					"Job_Status": resourceObj.Job_Status,
					"Input": resourceObj.Input,
					"Holdpart": [draggeddata]
				}

				// resourceObj[this.segselect].results.push(draggeddata);                

				that.oBusyDialog.open();
				that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/BayDetailsSet", dataHold, {
					success: function (oEvent) {
						that.oBusyDialog.close();
						/*	resourceObj.SA_CAL.results.push(draggeddata);*/
						// sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						//	odatEve.getModel().getData()[path[1]].splice(path, 1);
						that._ReadCalendermodel();
						that._ReadHaedrandtobeassigned();
						that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
						if (oEvent.Flag === "E") {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.ERROR, "Error");
						} else {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						}
					},
					error: function (err) {
						that.oBusyDialog.close();
						resourceObj[that.segselect].results.pop();

						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					}
				});


			} else {
				sap.m.MessageBox.show("Cannot assign Vehicle to past time", sap.m.MessageBox.Icon.ERROR, "Error");
			}

		},
		onListPlanningCalendarDropholdsu: function (oEvent) {
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			var pcRow = sap.ui.getCore().byId(rowId);
			var oBindingContext = pcRow.getBindingContext("oLocalJsonModel");
			var resourceObj = oBindingContext.getObject();
			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");
			var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.id.split('AppsInt')[1]);
			//	var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
			if (isNaN(dropappstartposition)) {
				// dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
				dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.parentElement.id.split('AppsInt')[1]);
			}
			// new logic for exact timestamp
			var offset = oEvent.getParameters().browserEvent.offsetX / 10;
			var offsetmins = offset * 7.5;
			// new logic for exact timestamp
			var dropappendposition = dropappstartposition + 0.50;
			var dropaptstartdate = this.getView().byId("PC2").getStartDate().getTime() + dropappstartposition * 60 * 60 * 1000;
			var dropaptenddate = this.getView().byId("PC2").getStartDate().getTime() + dropappendposition * 60 * 60 * 1000;
			var path = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").sPath.split('/');
			var draggeddata = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").getModel().getData()[path[1]][path[2]];
			delete draggeddata.__metadata;
			// new logic for exact start timestamp
			var startdate = new Date(dropaptstartdate)
			startdate.setMinutes(startdate.getMinutes() + offsetmins);
			draggeddata.Start_Timestamp = new Date(startdate);
			var enddate = new Date(dropaptenddate)
			enddate.setMinutes(enddate.getMinutes() + offsetmins);
			draggeddata.End_Timestamp = new Date(enddate);
			// new logic for exact start timestamp
			// old logic commented
			// draggeddata.Start_Timestamp=new Date(dropaptstartdate);
			// draggeddata.End_Timestamp=new Date(dropaptenddate);
			// old logic commented
			//  if(new Date(dropaptstartdate) >= new Date() ){
			if (new Date(startdate) >= new Date()) {
				draggeddata.Input = "ASSIGNHOLDSUB";
				var entiypath;
				// if(this.segselect === "BAYWISE"){
				draggeddata.BayCategory = resourceObj.BayCat;
				draggeddata.BayName = resourceObj.BayName;
				entiypath = "/BayDetailsSet";
				// }else if(this.segselect === "TechWise"){
				// draggeddata.Technicion_Name=resourceObj.EMP_Name;
				// draggeddata.Technicion_No=resourceObj.EMP_NO;
				// entiypath="/TechnicianDetailsSet";
				// }else if(this.segselect === "InspectorWise"){
				// draggeddata.FloorSupervisor_No=resourceObj.EMP_NO;
				// draggeddata.FloorSupervisor_Name=resourceObj.EMP_Name;
				// entiypath="/InspectorDetailsSet";
				// }

				var odatEve = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel");
				var that = this;

				// delete resourceObj[0].ADD_TAB;
				var dataHold = {
					"BayName": resourceObj.BayName,
					"BayCat": resourceObj.BayCat,
					"BayCount": resourceObj.BayCount,
					"BayStatus": resourceObj.BayStatus,
					"Cust_Priority": resourceObj.Cust_Priority,
					"Booking_Type": resourceObj.Booking_Type,
					"Status": resourceObj.Status,
					"Job_Day": resourceObj.Job_Day,
					"Msg": resourceObj.Msg,
					"Flag": resourceObj.Flag,
					"Job_Status": resourceObj.Job_Status,
					"Input": resourceObj.Input,
					"Hsub": [draggeddata]
				}

				// resourceObj[this.segselect].results.push(draggeddata);                

				that.oBusyDialog.open();
				that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create(entiypath, dataHold, {
					success: function (oEvent) {
						that.oBusyDialog.close();
						/*	resourceObj.SA_CAL.results.push(draggeddata);*/
						// sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						//	odatEve.getModel().getData()[path[1]].splice(path, 1);
						that._ReadCalendermodel();
						that._ReadHaedrandtobeassigned();
						that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
						if (oEvent.Flag === "E") {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.ERROR, "Error");
						} else {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						}
					},
					error: function (err) {
						that.oBusyDialog.close();
						resourceObj[that.segselect].results.pop();

						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					}
				});


			} else {
				sap.m.MessageBox.show("Cannot assign Vehicle to past time", sap.m.MessageBox.Icon.ERROR, "Error");
			}

		},

		onListPlanningCalendarDropholdot: function (oEvent) {
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			var pcRow = sap.ui.getCore().byId(rowId);
			var oBindingContext = pcRow.getBindingContext("oLocalJsonModel");
			var resourceObj = oBindingContext.getObject();
			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");
			var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.id.split('AppsInt')[1]);
			//	var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
			if (isNaN(dropappstartposition)) {
				// dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
				dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.parentElement.id.split('AppsInt')[1]);
			}
			// new logic for exact timestamp
			var offset = oEvent.getParameters().browserEvent.offsetX / 10;
			var offsetmins = offset * 7.5;
			// new logic for exact timestamp
			var dropappendposition = dropappstartposition + 0.50;
			var dropaptstartdate = this.getView().byId("PC2").getStartDate().getTime() + dropappstartposition * 60 * 60 * 1000;
			var dropaptenddate = this.getView().byId("PC2").getStartDate().getTime() + dropappendposition * 60 * 60 * 1000;
			var path = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").sPath.split('/');
			var draggeddata = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").getModel().getData()[path[1]][path[2]];
			delete draggeddata.__metadata;
			// new logic for exact start timestamp
			var startdate = new Date(dropaptstartdate)
			startdate.setMinutes(startdate.getMinutes() + offsetmins);
			draggeddata.Start_Timestamp = new Date(startdate);
			var enddate = new Date(dropaptenddate)
			enddate.setMinutes(enddate.getMinutes() + offsetmins);
			draggeddata.End_Timestamp = new Date(enddate);
			// new logic for exact start timestamp
			// old logic commented
			// draggeddata.Start_Timestamp=new Date(dropaptstartdate);
			// draggeddata.End_Timestamp=new Date(dropaptenddate);
			// old logic commented
			//  if(new Date(dropaptstartdate) >= new Date() ){
			if (new Date(startdate) >= new Date()) {
				draggeddata.Input = "ASSIGNHOLDOTHER";
				var entiypath;
				// if(this.segselect === "BAYWISE"){
				draggeddata.BayCategory = resourceObj.BayCat;
				draggeddata.BayName = resourceObj.BayName;
				entiypath = "/BayDetailsSet";
				// }else if(this.segselect === "TechWise"){
				// draggeddata.Technicion_Name=resourceObj.EMP_Name;
				// draggeddata.Technicion_No=resourceObj.EMP_NO;
				// entiypath="/TechnicianDetailsSet";
				// }else if(this.segselect === "InspectorWise"){
				// draggeddata.FloorSupervisor_No=resourceObj.EMP_NO;
				// draggeddata.FloorSupervisor_Name=resourceObj.EMP_Name;
				// entiypath="/InspectorDetailsSet";
				// }

				var odatEve = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel");
				var that = this;

				// delete resourceObj[0].ADD_TAB;
				var dataHold = {
					"BayName": resourceObj.BayName,
					"BayCat": resourceObj.BayCat,
					"BayCount": resourceObj.BayCount,
					"BayStatus": resourceObj.BayStatus,
					"Cust_Priority": resourceObj.Cust_Priority,
					"Booking_Type": resourceObj.Booking_Type,
					"Status": resourceObj.Status,
					"Job_Day": resourceObj.Job_Day,
					"Msg": resourceObj.Msg,
					"Flag": resourceObj.Flag,
					"Job_Status": resourceObj.Job_Status,
					"Input": resourceObj.Input,
					"Hother": [draggeddata]
				}

				// resourceObj[this.segselect].results.push(draggeddata);                

				that.oBusyDialog.open();
				that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/BayDetailsSet", dataHold, {
					success: function (oEvent) {
						that.oBusyDialog.close();
						/*	resourceObj.SA_CAL.results.push(draggeddata);*/
						// sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						//	odatEve.getModel().getData()[path[1]].splice(path, 1);
						that._ReadCalendermodel();
						that._ReadHaedrandtobeassigned();
						that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
						if (oEvent.Flag === "E") {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.ERROR, "Error");
						} else {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						}
					},
					error: function (err) {
						that.oBusyDialog.close();
						resourceObj[that.segselect].results.pop();

						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					}
				});


			} else {
				sap.m.MessageBox.show("Cannot assign Vehicle to past time", sap.m.MessageBox.Icon.ERROR, "Error");
			}

		},

		onListPlanningCalendarDroprt: function (oEvent) {
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			var pcRow = sap.ui.getCore().byId(rowId);
			var oBindingContext = pcRow.getBindingContext("oLocalJsonModel");
			var resourceObj = oBindingContext.getObject();
			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");
			var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.id.split('AppsInt')[1]);
			//	var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
			if (isNaN(dropappstartposition)) {
				// dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
				dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.parentElement.id.split('AppsInt')[1]);
			}
			// new logic for exact timestamp
			var offset = oEvent.getParameters().browserEvent.offsetX / 10;
			var offsetmins = offset * 7.5;
			// new logic for exact timestamp
			var dropappendposition = dropappstartposition + 0.50;
			var dropaptstartdate = this.getView().byId("PC2").getStartDate().getTime() + dropappstartposition * 60 * 60 * 1000;
			var dropaptenddate = this.getView().byId("PC2").getStartDate().getTime() + dropappendposition * 60 * 60 * 1000;
			var path = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").sPath.split('/');
			var draggeddata = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").getModel().getData()[path[1]][path[2]];
			delete draggeddata.__metadata;
			// new logic for exact start timestamp
			var startdate = new Date(dropaptstartdate)
			startdate.setMinutes(startdate.getMinutes() + offsetmins);
			draggeddata.Start_Timestamp = new Date(startdate);
			var enddate = new Date(dropaptenddate)
			enddate.setMinutes(enddate.getMinutes() + offsetmins);
			draggeddata.End_Timestamp = new Date(enddate);
			// new logic for exact start timestamp
			// old logic commented
			// draggeddata.Start_Timestamp=new Date(dropaptstartdate);
			// draggeddata.End_Timestamp=new Date(dropaptenddate);
			// old logic commented
			//  if(new Date(dropaptstartdate) >= new Date() ){
			if (new Date(startdate) >= new Date()) {
				draggeddata.Input = "ASSIGNHOLDROADTEST";
				var entiypath;
				// if(this.segselect === "BAYWISE"){
				draggeddata.BayCategory = resourceObj.BayCat;
				draggeddata.BayName = resourceObj.BayName;
				entiypath = "/BayDetailsSet";
				// }else if(this.segselect === "TechWise"){
				// draggeddata.Technicion_Name=resourceObj.EMP_Name;
				// draggeddata.Technicion_No=resourceObj.EMP_NO;
				// entiypath="/TechnicianDetailsSet";
				// }else if(this.segselect === "InspectorWise"){
				// draggeddata.FloorSupervisor_No=resourceObj.EMP_NO;
				// draggeddata.FloorSupervisor_Name=resourceObj.EMP_Name;
				// entiypath="/InspectorDetailsSet";
				// }

				var odatEve = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel");
				var that = this;

				// delete resourceObj[0].ADD_TAB;
				var dataHold = {
					"BayName": resourceObj.BayName,
					"BayCat": resourceObj.BayCat,
					"BayCount": resourceObj.BayCount,
					"BayStatus": resourceObj.BayStatus,
					"Cust_Priority": resourceObj.Cust_Priority,
					"Booking_Type": resourceObj.Booking_Type,
					"Status": resourceObj.Status,
					"Job_Day": resourceObj.Job_Day,
					"Msg": resourceObj.Msg,
					"Flag": resourceObj.Flag,
					"Job_Status": resourceObj.Job_Status,
					"Input": resourceObj.Input,
					"Hldrtest": [draggeddata]
				}

				// resourceObj[this.segselect].results.push(draggeddata);                

				that.oBusyDialog.open();
				that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create(entiypath, dataHold, {
					success: function (oEvent) {
						that.oBusyDialog.close();
						/*	resourceObj.SA_CAL.results.push(draggeddata);*/
						// sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						//	odatEve.getModel().getData()[path[1]].splice(path, 1);
						that._ReadCalendermodel();
						that._ReadHaedrandtobeassigned();
						that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
						if (oEvent.Flag === "E") {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.ERROR, "Error");
						} else {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						}
					},
					error: function (err) {
						that.oBusyDialog.close();
						resourceObj[that.segselect].results.pop();

						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					}
				});


			} else {
				sap.m.MessageBox.show("Cannot assign Vehicle to past time", sap.m.MessageBox.Icon.ERROR, "Error");
			}

		},

		onListPlanningCalendarDropsu: function (oEvent) {
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			var pcRow = sap.ui.getCore().byId(rowId);
			var oBindingContext = pcRow.getBindingContext("oLocalJsonModel");
			var resourceObj = oBindingContext.getObject();
			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");
			var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.id.split('AppsInt')[1]);
			//	var dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
			if (isNaN(dropappstartposition)) {
				// dropappstartposition = parseInt(oEvent.getParameter('browserEvent').path[1].id.split('AppsInt')[1]);
				dropappstartposition = parseInt(oEvent.getParameter('browserEvent').target.parentElement.id.split('AppsInt')[1]);
			}
			// new logic for exact timestamp
			var offset = oEvent.getParameters().browserEvent.offsetX / 10;
			var offsetmins = offset * 7.5;
			// new logic for exact timestamp
			var dropappendposition = dropappstartposition + 0.50;
			var dropaptstartdate = this.getView().byId("PC2").getStartDate().getTime() + dropappstartposition * 60 * 60 * 1000;
			var dropaptenddate = this.getView().byId("PC2").getStartDate().getTime() + dropappendposition * 60 * 60 * 1000;
			var path = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").sPath.split('/');
			var draggeddata = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel").getModel().getData()[path[1]][path[2]];
			delete draggeddata.__metadata;
			// new logic for exact start timestamp
			var startdate = new Date(dropaptstartdate)
			startdate.setMinutes(startdate.getMinutes() + offsetmins);
			draggeddata.Start_Timestamp = new Date(startdate);
			var enddate = new Date(dropaptenddate)
			enddate.setMinutes(enddate.getMinutes() + offsetmins);
			draggeddata.End_Timestamp = new Date(enddate);
			// new logic for exact start timestamp
			// old logic commented
			// draggeddata.Start_Timestamp=new Date(dropaptstartdate);
			// draggeddata.End_Timestamp=new Date(dropaptenddate);
			// old logic commented
			//  if(new Date(dropaptstartdate) >= new Date() ){
			if (new Date(startdate) >= new Date()) {
				draggeddata.Input = "ASSIGNHOLDSUBLET";
				var entiypath;
				// if(this.segselect === "BAYWISE"){
				draggeddata.BayCategory = resourceObj.BayCat;
				draggeddata.BayName = resourceObj.BayName;
				entiypath = "/BayDetailsSet";
				// }else if(this.segselect === "TechWise"){
				// draggeddata.Technicion_Name=resourceObj.EMP_Name;
				// draggeddata.Technicion_No=resourceObj.EMP_NO;
				// entiypath="/TechnicianDetailsSet";
				// }else if(this.segselect === "InspectorWise"){
				// draggeddata.FloorSupervisor_No=resourceObj.EMP_NO;
				// draggeddata.FloorSupervisor_Name=resourceObj.EMP_Name;
				// entiypath="/InspectorDetailsSet";
				// }

				var odatEve = oEvent.getParameters().draggedControl.getBindingContext("oLocalJsonModel");
				var that = this;

				// delete resourceObj[0].ADD_TAB;
				var dataHold = {
					"BayName": resourceObj.BayName,
					"BayCat": resourceObj.BayCat,
					"BayCount": resourceObj.BayCount,
					"BayStatus": resourceObj.BayStatus,
					"Cust_Priority": resourceObj.Cust_Priority,
					"Booking_Type": resourceObj.Booking_Type,
					"Status": resourceObj.Status,
					"Job_Day": resourceObj.Job_Day,
					"Msg": resourceObj.Msg,
					"Flag": resourceObj.Flag,
					"Job_Status": resourceObj.Job_Status,
					"Input": resourceObj.Input,
					"Hldsublet": [draggeddata]
				}

				// resourceObj[this.segselect].results.push(draggeddata);                

				that.oBusyDialog.open();
				that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create(entiypath, dataHold, {
					success: function (oEvent) {
						that.oBusyDialog.close();
						/*	resourceObj.SA_CAL.results.push(draggeddata);*/
						// sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						//	odatEve.getModel().getData()[path[1]].splice(path, 1);
						that._ReadCalendermodel();
						that._ReadHaedrandtobeassigned();
						that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
						if (oEvent.Flag === "E") {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.ERROR, "Error");
						} else {
							sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.INFORMATION, "INFORMATION")
						}
					},
					error: function (err) {
						that.oBusyDialog.close();
						resourceObj[that.segselect].results.pop();

						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					}
				});


			} else {
				sap.m.MessageBox.show("Cannot assign Vehicle to past time", sap.m.MessageBox.Icon.ERROR, "Error");
			}

		},


		/*	onListPlanningCalendardragStart: function(oEvent) {
				var oDragSession = oEvent.getParameter("dragSession");
				var oDraggedRow = oEvent.getParameter("target");
				this.oContextBinding = oDraggedRow.getBindingContext("fracMappingData");
				oDragSession.setComplexData("onListDragContext", oDraggedRow);
			},*/


		handleAppointmentDragEnter: function (oEvent) {
			if (this.isAppointmentOverlap(oEvent, oEvent.getParameter("calendarRow"))) {
				oEvent.preventDefault();
			}
		},

		handleAppointmentDrop: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				oCalendarRow = oEvent.getParameter("calendarRow"),
				bCopy = oEvent.getParameter("copy"),
				sTitle = oAppointment.getTitle();
			var that = this;
			var selecteddata = that.getOwnerComponent().getModel('oLocalJsonModel').getProperty(oEvent.getParameters().appointment.oBindingContexts.oLocalJsonModel.sPath);
			selecteddata.Input = "ASSIGN"
			// oModel = this.getView().getModel(),
			// oModel=this.getOwnerComponent().getModel("oLocalJsonModel"),
			// oAppBindingContext = oAppointment.getBindingContext(),
			// oRowBindingContext = oCalendarRow.getBindingContext(),
			// handleAppointmentDropBetweenRows = function () {
			// 	var aPath = oAppBindingContext.getPath().split("/"),
			// 		iIndex = aPath.pop(),
			// 		sRowAppointmentsPath = aPath.join("/");

			// 	oRowBindingContext.getObject().appointments.push(
			// 		oModel.getProperty(oAppBindingContext.getPath())
			// 	);

			// 	oModel.getProperty(sRowAppointmentsPath).splice(iIndex, 1);
			// };

			// if (bCopy) { // "copy" appointment
			// 	var oProps = Object.assign({}, oModel.getProperty(oAppointment.getBindingContext().getPath()));
			// 	oProps.start = oStartDate;
			// 	oProps.end = oEndDate;

			// 	oRowBindingContext.getObject().appointments.push(oProps);
			// } else { // "move" appointment
			// oModel.setProperty("start", oStartDate, oAppBindingContext);
			// oModel.setProperty("end", oEndDate, oAppBindingContext);

			if (oAppointment.getParent() !== oCalendarRow) {
				// handleAppointmentDropBetweenRows();
				selecteddata.BayCategory = that.getOwnerComponent().getModel('oLocalJsonModel').getProperty(oCalendarRow.oBindingContexts.oLocalJsonModel.sPath).BayCategory;
				selecteddata.BayName = that.getOwnerComponent().getModel('oLocalJsonModel').getProperty(oCalendarRow.oBindingContexts.oLocalJsonModel.sPath).BayName;
			}
			// }

			// oModel.refresh(true);


			// selecteddata.Start_Timestamp = new Date(sap.ui.getCore().byId("PlanStartDate").getValue());
			// selecteddata.End_Timestamp = new Date(sap.ui.getCore().byId("promisedDeliveryDate").getValue());
			selecteddata.Start_Timestamp = oStartDate;
			selecteddata.End_Timestamp = oEndDate;

			// that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]][this.segselect]['results'][that.Appselect[5]]=selecteddata;
			// var data=that.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'][that.Appselect[2]];

			that.oBusyDialog.open();
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/ToBeAssignedSet", selecteddata, {
				success: function (oeve) {
					that.oBusyDialog.close();
					that._ReadCalendermodel();
					that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
					that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
					sap.m.MessageBox.show("Calendar Updated Sucussfully");
				},
				error: function (err) {
					that.oBusyDialog.close();
					sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
				}
			});



			// MessageToast.show(oCalendarRow.getTitle() + "'s '" + "Appointment '" + sTitle + "' now starts at \n" + oStartDate + "\n and end at \n" + oEndDate + ".");
		},



		handleAppointmentResize: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate");
			// var path=oAppointment.sId.split("-");
			var path = oEvent.getParameters().appointment.oBindingContexts.oLocalJsonModel.getPath().split("/");
			// var data=this.getOwnerComponent().getModel('oLocalJsonModel').getData()['calendarModel'][path[7]][this.segselect].results[path[8]];
			var data = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['calendarModel'][path[2]][this.segselect].results[path[5]];
			data.Start_Timestamp = new Date(oStartDate);
			data.End_Timestamp = new Date(oEndDate);
			data.Input = "ASSIGN";
			// var finaldata= this.getOwnerComponent().getModel('oLocalJsonModel').getData()['calendarModel'][path[8]];
			var finaldata = this.getOwnerComponent().getModel('oLocalJsonModel').getData()['calendarModel'][path[2]];
			var entiypath;
			// if(this.segselect === "BAYWISE"){

			entiypath = "/BayDetailsSet";
			// }else if(this.segselect === "TechWise"){

			// entiypath="/TechnicianDetailsSet";
			// }else if(this.segselect === "InspectorWise"){

			// entiypath="/InspectorDetailsSet";
			// }
			if (!this.isAppointmentOverlap(oEvent, oAppointment.getParent())) {
				var that = this;
				that.oBusyDialog.open();

				that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create(entiypath, finaldata, {
					success: function (oEvent) {
						that.oBusyDialog.close();


						oAppointment
							.setStartDate(oStartDate)
							.setEndDate(oEndDate);
						that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
					},
					error: function (err) {
						that.oBusyDialog.close();


						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					}
				});
			} /*else {
				MessageToast.show("As a manager you can not resize events if they overlap with another events");
			}*/
		},



		isAppointmentOverlap: function (oEvent, oCalendarRow) {
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				bAppointmentOverlapped;




			//		if (this.getUserRole() === this.roles.manager) {
			bAppointmentOverlapped = oCalendarRow.getAppointments().some(function (oCurrentAppointment) {
				if (oCurrentAppointment === oAppointment) {
					return;
				}

				var oAppStartTime = oCurrentAppointment.getStartDate().getTime(),
					oAppEndTime = oCurrentAppointment.getEndDate().getTime();

				if (oAppStartTime <= oStartDate.getTime() && oStartDate.getTime() < oAppEndTime) {
					return true;
				}

				if (oAppStartTime < oEndDate.getTime() && oEndDate.getTime() <= oAppEndTime) {
					return true;
				}

				if (oStartDate.getTime() <= oAppStartTime && oAppStartTime < oEndDate.getTime()) {
					return true;
				}
			});
			//	}
			return bAppointmentOverlapped;
		},
		handleAppointmentSelect: function (oeve) {
			this.Appselect = oeve.getParameters().appointment.oBindingContexts.oLocalJsonModel.getPath().split("/");

			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignSAModeldata", oeve.getParameters().appointment.oBindingContexts
				.oLocalJsonModel.getModel().getData()[this.Appselect[1]][this.Appselect[2]][this.segselect]['results'][this.Appselect[5]]);
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignSAModelPopup", this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/AssignSAModeldata"));
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ResetDataPopup", this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/AssignSAModeldata"));
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/cancelactionenableflag", true);
			// this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignSAModelPopup", oeve.getParameters().appointment.oBindingContexts
			// .oLocalJsonModel.getModel().getData()[this.Appselect[1]][this.Appselect[2]][this.segselect]['results'][this.Appselect[5]]);
			// this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ResetDataPopup", oeve.getParameters().appointment.oBindingContexts
			// .oLocalJsonModel.getModel().getData()[this.Appselect[1]][this.Appselect[2]][this.segselect]['results'][this.Appselect[5]]);
			var Technician = this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/AssignSAModeldata").Technicion_No;
			if(Technician !== "00000000" && Technician ){
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
			}
			var TechEnable= this.getView().getModel("oLocalJsonModel").getProperty('/MainTechnicianSetmodel').length;
			if(TechEnable === 1){
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
			
			}
			if (!this._ValueUnAssignROJCB) {

				this._ValueUnAssignROJCB = sap.ui.xmlfragment("comZJCB.fragment.AssignSA", this);
				this.getView().addDependent(this._ValueUnAssignROJCB);
			}
			// for disabling calender manual entry
			var plandate = sap.ui.getCore().byId("PlanStartDate");
			var promisedDeliveryDate = sap.ui.getCore().byId("promisedDeliveryDate");
			plandate.addEventDelegate({
				onAfterRendering: function () {
					plandate.$().find('INPUT').attr('disabled', true);
				}
			}, plandate);
			promisedDeliveryDate.addEventDelegate({
				onAfterRendering: function () {
					promisedDeliveryDate.$().find('INPUT').attr('disabled', true);
				}
			}, promisedDeliveryDate);
			// for disabling calender manual entry
			//		sap.ui.getCore().byId("promisedDeliveryDate").setText(this._dateconversion(this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].Gate_IN_Time));
			sap.ui.getCore().byId("PlanStartDate").setDateValue(new Date(this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].Start_Timestamp));
			sap.ui.getCore().byId("promisedDeliveryDate").setDateValue(new Date(this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].End_Timestamp));
			this._ValueUnAssignROJCB.open();
		},
_autoOpenAppointmentDialog: function(oAppointmentCtrl){
	this.Appselect = oAppointmentCtrl.oBindingContexts.oLocalJsonModel.getPath().split("/");
this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignSAModeldata", oAppointmentCtrl.oBindingContexts.oLocalJsonModel.getModel().getData()[this.Appselect[1]][this.Appselect[2]][this.segselect]['results'][this.Appselect[5]]);
this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignSAModelPopup", this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/AssignSAModeldata"));
 this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ResetDataPopup", this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/AssignSAModeldata"));
	
if (!this._ValueUnAssignROJCB) {
 this._ValueUnAssignROJCB = sap.ui.xmlfragment("comZJCB.fragment.AssignSA", this);
	this.getView().addDependent(this._ValueUnAssignROJCB);
 }
 var Technician = this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/AssignSAModeldata").Technicion_No;
			if(Technician !== "00000000" && Technician ){
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
			}
			var TechEnable= this.getView().getModel("oLocalJsonModel").getProperty('/MainTechnicianSetmodel').length;
			if(TechEnable === 1){
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
			
			}
	// for disabling calender manual entry
	 var plandate = sap.ui.getCore().byId("PlanStartDate");
	 var promisedDeliveryDate = sap.ui.getCore().byId("promisedDeliveryDate");
	 plandate.addEventDelegate({
	 onAfterRendering: function () {
	 plandate.$().find('INPUT').attr('disabled', true);
	 }
	}, plandate);
	promisedDeliveryDate.addEventDelegate({
	onAfterRendering: function () {
	promisedDeliveryDate.$().find('INPUT').attr('disabled', true);
	 }
	}, promisedDeliveryDate);
	// for disabling calender manual entry
	 //      sap.ui.getCore().byId("promisedDeliveryDate").setText(this._dateconversion(this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].Gate_IN_Time));
	sap.ui.getCore().byId("PlanStartDate").setDateValue(new Date(this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].Start_Timestamp));
	 sap.ui.getCore().byId("promisedDeliveryDate").setDateValue(new Date(this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].End_Timestamp));
	this._ValueUnAssignROJCB.open();
	this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/cancelactionenableflag", false);
	
},
		_dateconversion: function (datval) {
			const dateString = datval;
			const year = dateString.substring(0, 4);
			const month = dateString.substring(4, 6);
			const day = dateString.substring(6, 8);
			const hour = dateString.substring(8, 10);
			const minute = dateString.substring(10, 12);
			const second = dateString.substring(12, 14);

			var date = new Date(year, month - 1, day, hour, minute, second);
			return date;
		},
		onCancelDialog: function () {
			this._ValueUnAssignROJCB.close();
			this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'] = this.getOwnerComponent().getModel("oLocalJsonModel").getProperty("/ResetDataPopup");
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", false);
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/holdactionenableflag", false);
			this.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);

		},
		handleReassignCancle: function () {
			this._ValueReassignJCB.close();
			this.getOwnerComponent().getModel("oLocalJsonModel").getData()['Reassigndataset'] = this.getOwnerComponent().getModel("oLocalJsonModel").getData()['ResetReassigndataset'];
			this.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
		},
		handleReassign: function () {
			this._PostReassign();
			// var data=this.getOwnerComponent().getModel("oLocalJsonModel").getData()['Reassigndataset'];
			// var finaldata={
			// 	Vin_No:"",
			// 	Flag:"",
			// 	Msg:"",
			// 	REASSIGN:data
			// };
			// 		var that=this;
			// 		that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/JCBREASSIGNSet",	finaldata , {
			// 				success: function (oEvent) {
			// 						that.oBusyDialog.close();
			// 						/*	resourceObj.SA_CAL.results.push(draggeddata);*/
			// 						that._ValueReassign.close();
			// 		that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
			// 				},
			// 					error: function (err) {
			// 						that.oBusyDialog.close();

			// 					this.handleReassignCancle();

			// 			sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			// 					}
			// 				});
			// 		this._ValueReassign.close();
		},
		onpressReassignJCB: function () {
			this._ReadReassingTable(reassignselectedtech);
			this._ReadReassignReasondrpmodle();
			this.Assignallkey = "";
			this.AssignallName = "";
			// this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/Reassigndataset", this.getOwnerComponent().getModel(
			// 	"oLocalJsonModel").getData()['Reassigndata']);
			// 	this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ResetReassigndataset", this.getOwnerComponent().getModel(
			// 		"oLocalJsonModel").getData()['Reassigndata']);

			// this.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
			// this.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
			// if (!this._ValueReassign) {
			// 	this._ValueReassign = sap.ui.xmlfragment("comZJCB.fragment.Reassign", this);

			// 	this.getView().addDependent(this._ValueReassign);

			// }

			// this._ValueReassign.open();
			// reassignselectedtech="";
		},
		Hilight: function (oeve) {

			var ob = new Mark(document.getElementById("canvas"));

			// First unmark the highlighted word or letter
			ob.unmark(document.getElementById("canvas"));

			// Highlight letter or word
			ob.mark(oeve.getParameters().query);
		},
		onPressTagsTypes: function (oeve) {
			$("#" + this.Custfilterid).removeClass("Shadowfilterclass");
			this.Custfilterid = oeve.getSource().sId;
			//	$("#"+this.Custfilterid).addClass("Shadowfilterclass");
			Custfilter = oeve.getSource().mProperties.text;
			this.Multifilter();
		},
		onPressTagsTypes2: function (oeve) {
			$("#" + this.bookngtypfilterid).removeClass("Shadowfilterclass");
			this.bookngtypfilterid = oeve.getSource().sId;
			//	$("#"+this.bookngtypfilterid).addClass("Shadowfilterclass");
			bookngtypfilter = oeve.getSource().mProperties.text;
			this.Multifilter();
		},
		onPressTagsTypes3: function (oeve) {
			$("#" + this.statusfilterid).removeClass("Shadowfilterclass");
			this.statusfilterid = oeve.getSource().sId;
			//	$("#"+this.statusfilterid).addClass("Shadowfilterclass");
			statusfilter = oeve.getSource().mProperties.text;
			this.Multifilter();
		},
		onPressTagsTypes4: function (oeve) {
			$("#" + this.onsiteid).removeClass("Shadowfilterclass");
			this.onsiteid = oeve.getSource().sId;
			//	$("#"+this.statusfilterid).addClass("Shadowfilterclass");
			onsiteid = "O";
			this.Multifilter();
		},

		// 		onPressTagsTypes: function(oeve) {

		// Custfilter=oeve.getSource().mProperties.text;
		// this.Multifilter();
		// 		},
		// 		onPressTagsTypes2: function(oeve) {
		// bookngtypfilter=oeve.getSource().mProperties.text;
		// this.Multifilter();
		// 		},
		// 		onPressTagsTypes3: function(oeve) {
		// statusfilter=oeve.getSource().mProperties.text;
		// this.Multifilter();
		// 		},
		// 		Multifilter:function(){
		// 			var oTBA = this.getView().byId("idTBAs").getBinding("items");
		// 		//	var oPC=this.getOwnerComponent().getModel("oLocalJsonModel").getData()['calendarModel'];
		// 		//	oTBA.filter([]);
		// 			filterAll=[];
		// 			//this.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
		// 			this.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
		// 			this.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
		// 			if(bookngtypfilter !== ""){
		// 			filterAll.push(new sap.ui.model.Filter("Booking_Type", sap.ui.model.FilterOperator.EQ, bookngtypfilter));
		// 			}
		// 			if(Custfilter !== ""){
		// 			filterAll.push(new sap.ui.model.Filter("Cust_Priority", sap.ui.model.FilterOperator.EQ, Custfilter));
		// 					}
		// 			if(statusfilter !== ""){
		// 					filterAll.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, statusfilter));
		// 			}

		// //	var oTBA = this.getView().byId("idTBAs").getBinding("items");

		// 			oTBA.filter(filterAll);
		// 			this.getView().byId("KAMFilter").setVisible(true);
		// 			var that=this;
		// 		//	var sFilters = [];
		// 		//	sFilters.push(new sap.ui.model.Filter("Cust_Priority", sap.ui.model.FilterOperator.EQ, "KAM"));
		// 			var oSuccessCalend = function(oData) {
		// 				that.oBusyDialog.close();

		// 				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarModel", oData.results);


		// 			};
		// 			var oErrorCalend = function(err) {
		// 				that.oBusyDialog.close();

		// 				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
		// 			};
		// 			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/SA_HdrSet", {
		// 				urlParameters: {
		// 					"$expand": "SA_CAL"

		// 				},
		// 				filters: filterAll,
		// 				success: oSuccessCalend,
		// 				error: oErrorCalend
		// 			});
		// 			that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
		// 			that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
		// 		},
		// 		Clearfilter: function(oeve) {

		// 			var oTBA = this.getView().byId("idTBAs").getBinding("items");
		// 			oTBA.filter([]);
		// 			var that=this;
		// 			var oSuccessCalend = function(oData) {
		// 				that.oBusyDialog.close();

		// 				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarModel", oData.results);


		// 			};
		// 			var oErrorCalend = function(err) {
		// 				that.oBusyDialog.close();

		// 				sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
		// 			};
		// 			that.getOwnerComponent().getModel("ZRECEPTIONIST_SRV").read("/SA_HdrSet", {
		// 				urlParameters: {
		// 					"$expand": "SA_CAL"

		// 				},
		// 				filters:[],
		// 				success: oSuccessCalend,
		// 				error: oErrorCalend
		// 			});
		// 			Custfilter="";
		// 			statusfilter="";
		// 			bookngtypfilter="";
		// 			unassfilter="";
		// 			that.getView().byId("KAMFilter").setVisible(false);
		// 			that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
		// 		},
		OnReassignSAAll: function (oeveall) {

			var popdata = this.getOwnerComponent().getModel("oLocalJsonModel").getData()['Reassigndata'];
			for (var k = 0; k < popdata.length; k++) {
				//popdata[k].EmpNo=this.Assignallkey;
				popdata[k].Assigned_adsr = this.Assignallkey;
			}
			this.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
			this.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);

		},
		handleSelectionSA: function (oeve) {
			this.Assignallkey = oeve.getSource().getSelectedKey();
			this.AssignallName = oeve.getSource()._getSelectedItemText();
			if (this.Assignallkey === "") {

				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignallButton", false);
			} else {

				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignallButton", true);
			}
		},
		OnSASearchcal: function (oeve) {
			var x = oeve.getParameters().query;
			//	var aFilter =[new sap.ui.model.Filter("SA_Name", sap.ui.model.FilterOperator.Contains, x),
			//	new sap.ui.model.Filter("SA_No", sap.ui.model.FilterOperator.Contains, x),and: false];
			var cloumname, columno, id;
			if (this.segselect === 'BAYWISE') {
				cloumname = "BayName";
				columno = "BayCat";
				id = "PC2";
			} else if (this.segselect === 'TechWise') {
				cloumname = "EMP_Name";
				columno = "EMP_NO";
				id = "PC1";
			} else if (this.segselect === 'InspectorWise') {
				cloumname = "EMP_Name";
				columno = "EMP_NO";
				id = "PC3";
			} else if (this.segselect === 'Vehicle') {
				cloumname = "EMP_Name";
				columno = "EMP_NO";
				id = "PC4";
			}
			var filter1 = new sap.ui.model.Filter(cloumname, sap.ui.model.FilterOperator.Contains, x);
			var filter2 = new sap.ui.model.Filter(columno, sap.ui.model.FilterOperator.Contains, x);

			// Applying OR filter to filter objects
			var orFilter = new sap.ui.model.Filter([filter1, filter2], false);
			var oVBox = this.getView().byId(id).getBinding("rows");
			oVBox.filter(orFilter);
			this.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
			this.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
		},
		onPressTagCustpriority: function (oeve) {
			$("#" + this.Custfilterid).removeClass("Shadowfilterclass");
			this.Custfilterid = oeve.getSource().sId;
			//	$("#"+this.Custfilterid).addClass("Shadowfilterclass");
			var custval = oeve.getSource().mProperties.text.toLocaleUpperCase();
			custval = custval.replace(/ +/g, "");
			this.Cust_Priority = custval;
			this.Multifilter();
		},
		onPressTagbooktype: function (oeve) {
			$("#" + this.bookngtypfilterid).removeClass("Shadowfilterclass");
			this.bookngtypfilterid = oeve.getSource().sId;
			var bookval = oeve.getSource().mProperties.text.toLocaleUpperCase();
			bookval = bookval.replace(/ +/g, "");
			this.Booking_Type = bookval;
			this.Multifilter();
		},
		onPressTagStatus: function (oeve) {
			$("#" + this.statusfilterid).removeClass("Shadowfilterclass");
			this.statusfilterid = oeve.getSource().sId;
			var stattval = oeve.getSource().mProperties.text.toLocaleUpperCase();
			stattval = stattval.replace(/ +/g, "");
			this.Status = stattval;
			this.Multifilter();
		},
		onPressvehattend: function (oeve) {
			$("#" + this.vehattendfilterid).removeClass("Shadowfilterclass");
			this.vehattendfilterid = oeve.getSource().sId;
			var vehattendval = oeve.getSource().mProperties.text.toLocaleUpperCase();
			vehattendval = vehattendval.replace(/ +/g, "");
			this.vehattend = vehattendval;
			this.Multifilter();
		},
		onPressTagjobday: function (oeve) {
			$("#" + this.jobdayfilerid).removeClass("Shadowfilterclass");
			this.jobdayfilerid = oeve.getSource().sId;
			var dayval = oeve.getSource().mProperties.text.toLocaleUpperCase();
			dayval = dayval.replace(/ +/g, "");
			this.Job_Day = dayval;
			this.Multifilter();
		},
		onPressTagjobstatus: function (oeve) {
			$("#" + this.jobstatusfilterid).removeClass("Shadowfilterclass");
			this.jobstatusfilterid = oeve.getSource().sId;
			var jobstattval = oeve.getSource().mProperties.text.toLocaleUpperCase();
			jobstattval = jobstattval.replace(/ +/g, "");
			this.Job_Status = jobstattval;
			this.Multifilter();
		},
		onPressTagunassigntech: function (oeve) {
			$("#" + this.techunassignfilterid).removeClass("Shadowfilterclass");
			this.techunassignfilterid = oeve.getSource().sId;
			var techunassignval = oeve.getSource().mProperties.text.toLocaleUpperCase();
			techunassignval = techunassignval.replace(/ +/g, "");
			this.Vehicle_Unassign = techunassignval;
			this.Multifilter();
		},
		_TBAFiltering: function () {
			var that = this;
			var oSuccessHeadTBAFilt = function (oData) {
				that.oBusyDialog.close();
				//	that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/CountDataset", oData);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignedToDataSet", oData.TBA_Call.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/HoldSubletdata", oData.JCBHOLDSU_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/HoldPartsdata", oData.JCBHOLDPA_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/Holdothersdata", oData.JCBHOLDOT_NAV.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignedToDataSetCount", oData.TBA_Call.results.length);


			};
			var oErrorHeadTBAFilt = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.error(err.message);
			};
			var sFiltersTBA = [];
			sFiltersTBA.push(new sap.ui.model.Filter("Cust_Priority", sap.ui.model.FilterOperator.EQ, that.Cust_Priority));
			sFiltersTBA.push(new sap.ui.model.Filter("Booking_Type", sap.ui.model.FilterOperator.EQ, that.Booking_Type));
			sFiltersTBA.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, that.Status));

			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/HeaderInfoSet('')", {
				filters: sFiltersTBA,
				urlParameters: {
					"$expand": "TBA_Call"
				},
				success: oSuccessHeadTBAFilt,
				error: oErrorHeadTBAFilt
			});
		},
		Multifilter: function () {
			this.getView().byId("KAMFilter").setVisible(true);
			var that = this;
			that.oBusyDialog.open();
			that._TBAFiltering();
			var oSuccessCalend = function (oData) {
				that.oBusyDialog.close();
				$("#" + that.Custfilterid).addClass("Shadowfilterclass");
				$("#" + that.statusfilterid).addClass("Shadowfilterclass");
				$("#" + that.vehattendfilterid).addClass("Shadowfilterclass");
				$("#" + that.bookngtypfilterid).addClass("Shadowfilterclass");
				$("#" + that.jobdayfilerid).addClass("Shadowfilterclass");
				$("#" + that.jobstatusfilterid).addClass("Shadowfilterclass");
				$("#" + that.techunassignfilterid).addClass("Shadowfilterclass");
				if (that.segselect === "BAYWISE") {
					that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarModel", oData.results);
				} else if (that.segselect === "TechWise") {
					that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarTechModel", oData.results);
				} else if (that.segselect === "InspectorWise") {
					that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarInspModel", oData.results);
				}
			};
			var oErrorCalend = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			var path;
			if (that.segselect === "BAYWISE") {
				path = "/BayDetailsSet";


			} else if (that.segselect === "TechWise") {
				path = "/TechnicianDetailsSet";

			} else if (that.segselect === "InspectorWise") {
				path = "/InspectorDetailsSet";

			}
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Cust_Priority", sap.ui.model.FilterOperator.EQ, that.Cust_Priority));
			sFilters.push(new sap.ui.model.Filter("Booking_Type", sap.ui.model.FilterOperator.EQ, that.Booking_Type));
			sFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, that.Status));
			sFilters.push(new sap.ui.model.Filter("Vehicle_attended", sap.ui.model.FilterOperator.EQ, that.vehattend));
			sFilters.push(new sap.ui.model.Filter("Job_Day", sap.ui.model.FilterOperator.EQ, that.Job_Day));
			sFilters.push(new sap.ui.model.Filter("Job_Status", sap.ui.model.FilterOperator.EQ, that.Job_Status));
			sFilters.push(new sap.ui.model.Filter("Vehicle_Unassign", sap.ui.model.FilterOperator.EQ, that.Vehicle_Unassign));
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read(path, {
				urlParameters: {
					"$expand": that.segselect

				},
				filters: sFilters,
				success: oSuccessCalend,
				error: oErrorCalend
			});
			// that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
			// that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
		},
		Clearfilter: function (oeve) {

			$(".TopToolBar .sapMGenericTag").removeClass("Shadowfilterclass");
			var that = this;
			var path;
			if (that.segselect === "BAYWISE") {
				path = "/BayDetailsSet";


			} else if (that.segselect === "TechWise") {
				path = "/TechnicianDetailsSet";

			} else if (that.segselect === "InspectorWise") {
				path = "/InspectorDetailsSet";

			}
			var oSuccessCalend = function (oData) {
				that.oBusyDialog.close();
				if (that.segselect === "BAYWISE") {
					that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarModel", oData.results);
				} else if (that.segselect === "TechWise") {
					that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarTechModel", oData.results);
				} else if (that.segselect === "InspectorWise") {
					that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/calendarInspModel", oData.results);
				}



			};
			var oErrorCalend = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read(path, {
				urlParameters: {
					"$expand": that.segselect

				},
				filters: [],
				success: oSuccessCalend,
				error: oErrorCalend
			});
			that._ReadHaedrandtobeassigned();
			that.Cust_Priority = "";
			that.Booking_Type = "";
			that.Status = "";
			that.Job_Day = "";
			that.Job_Status = "";
			that.Vehicle_Unassign = "";
			that.Custfilterid = "";
			that.statusfilterid = "";
			that.vehattendfilterid = "";
			that.bookngtypfilterid = "";
			that.jobdayfilerid = "";
			that.jobstatusfilterid = "";
			that.techunassignfilterid = "";
			that.getView().byId("KAMFilter").setVisible(false);
			that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
		},
		handleStopAllJobs: function (oeve) {
			var that = this;
			that.oBusyDialog.open();
			var oSuccessmaintech = function (oData) {
				that.oBusyDialog.close();
				sap.m.MessageBox.show(oData.results[0].STOPALL);
				//that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/stopalldata", oData.results);
				that._ReadBaydrpmodel();
				that._ReadMainTechdrpmodle();
				that._Readforemandrpmodel();
				that._ReadCalendermodel();
				that._ReadFloverSupervisorlist();
				that._ReadHaedrandtobeassigned();
				that._ReadInspectCalendarmodel("All");
				that._ReadTechCalendarmodel("All");
				that._ReadVehTable();
				that._ReadVehCal();
				that._ReadDelaydrpmodel();
				that._ReadHolddrpmodel();

			};
			var oErrormaintech = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/JCBSTOPALLSet", {
				success: oSuccessmaintech,
				error: oErrormaintech
			});
		},
		_ReadReassingTable: function (Tech) {
			var that = this;
			that.oBusyDialog.open();
			var sFilters = [];
			sFilters.push(new sap.ui.model.Filter("Currntadv", sap.ui.model.FilterOperator.EQ, Tech));
			// sFilters.push(new sap.ui.model.Filter("Input", sap.ui.model.FilterOperator.EQ, Input));

			var oSuccessReassign = function (oData) {
				that.oBusyDialog.close();

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/Reassigndata", oData.results);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/Reassigndataset", that.getOwnerComponent().getModel(
					"oLocalJsonModel").getData()['Reassigndata']);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ResetReassigndataset", that.getOwnerComponent().getModel(
					"oLocalJsonModel").getData()['Reassigndata']);
				that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
				that.getOwnerComponent().getModel("oLocalJsonModel").refresh(true);
				if (!that._ValueReassignJCB) {
					that._ValueReassignJCB = sap.ui.xmlfragment("comZJCB.fragment.Reassign", that);

					that.getView().addDependent(that._ValueReassignJCB);

				}

				that._ValueReassignJCB.open();
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/ReassigndatasetVisible", true);
				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/Assignallselectkey", "");

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/AssignallButton", false);

				reassignselectedtech = "";
			};
			var oErrorReassign = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/Technician_ReassignSet", {
				filters: sFilters,
				success: oSuccessReassign,
				error: oErrorReassign
			});
		},
		_PostReassign: function (oeve) {
			var Reassigndata = this.getOwnerComponent().getModel("oLocalJsonModel").getData()['Reassigndata'];
			var finaldat = {
				"Jobno": "",
				"Msg": "",
				"Flag": "",
				"Reatech": Reassigndata
			}
			var that = this;
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/TechnicianHeaderSet", finaldat, {
				success: function (oEvent) {

					that.oBusyDialog.close();
					that._ValueReassignJCB.close();
					that._ReadTechCalendarmodel("All");
					that.getOwnerComponent().getModel("oLocalJsonModel").updateBindings(true);
					if (oEvent.Flag === "E") {
						sap.m.MessageBox.show(oEvent.Msg, sap.m.MessageBox.Icon.ERROR, "Error");
					} else {
						sap.m.MessageBox.success(oEvent.Msg);
					}

				},
				error: function (err) {
					that.oBusyDialog.close();
					that.handleReassignCancle();
					sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
				}
			});
		},
		onpressrowHeaderClick: function (oeve) {
			reassignselectedtech = oeve.getParameters().row.getTitle().split("-")[0];
			//this._ReadReassingTable(e.getParameters().row.getTitle().split("-")[0]);
		},
		handleholdchange: function () {
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/holdactionenableflag", true);
		},
		handleSelectionHold: function (oeve) {
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/holdactionenableflag", true);
			if (oeve.getSource().getSelectedKey() === "PARTS NOT AVAILABLE") {
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/POfield", true);
			} else {
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/POfield", false);
			}
		},
		onInspLegendpress: function (oeve) {

			this._ReadInspectCalendarmodel(oeve.getSource().getText());
		},
		onTechLegendpress: function (oeve) {

			this._ReadTechCalendarmodel(oeve.getSource().getText());
		},
		// onVehLegendpress:function(oeve){

		// 	this._ReadVehCal(oeve.getSource().getText());
		// },
		NavtoJCaddjob: function (oeve) {
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var o = sap.ushell.Container.getService("CrossApplicationNavigation");
				var n = o.hrefForExternal({
					target: {
						semanticObject: "Z_JCP",
						action: "display"
					},
					params: {
						action: "JCB_JOBDETAIL",
						Job_card: this.Navselecteddata.Order_No,
						VINNumber: this.Navselecteddata.Vin_No,

					}
				}) || "";
				var i = window.location.href.split("#")[0] + n;
				sap.m.URLHelper.redirect(i, true)
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/NavButtons", false);
			} else {
				sap.m.MessageBox.error("Cannot Navigate to Job Deatis page")
				this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/NavButtons", false);
			}
		},
		handleAppointmentSelectReadmode: function (oeve) {
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/NavButtons", true);
			this.AppselectReadmode = oeve.getParameters().appointment.oBindingContexts.oLocalJsonModel.getPath().split("/");

			this.Navselecteddata = oeve.getParameters().appointment.oBindingContexts
				.oLocalJsonModel.getModel().getData()[this.AppselectReadmode[1]][this.AppselectReadmode[2]][this.segselect]['results'][this.AppselectReadmode[5]];

		},
		handleSelectionflr: function (oeve) {

			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
			this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].FloorSupervisor_Name = oeve.getSource().getSelectedItem().getText();
		},
		handleSelectionTech: function (oeve) {
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
			this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].Technicion_Name = oeve.getSource().getSelectedItem().getText();
		},
		handleSelectionforeman: function (oeve) {
			this.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/assignactionenableflag", true);
			this.getOwnerComponent().getModel("oLocalJsonModel").getData()['AssignSAModelPopup'].Foreman_Name = oeve.getSource().getSelectedItem().getText();
		},
		firstVisibleRowChanged: function (oeve) {

			// for(var i=0;i<$("svg text").length;i++){

			// 	 $("svg text")[i].innerHTML=oeve.getSource().getModel("").getData()[oeve.getSource().getFirstVisibleRow()+i].id;

			// }
			for (var i = 0; i < +oeve.getSource().getRows().length; i++) {
				// oeve.getSource().getRows()[i].getCells()[9].rerender();
				// oeve.getSource().getRows()[i].getCells()[10].rerender();
				// oeve.getSource().getRows()[i].getCells()[11].rerender();
				// oeve.getSource().getRows()[i].getCells()[12].rerender();
				// oeve.getSource().getRows()[i].getCells()[13].rerender();
				$("#" + oeve.getSource().getRows()[i].getCells()[9].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].Two_Four_Time;
				$("#" + oeve.getSource().getRows()[i].getCells()[10].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].Re_Time;
				$("#" + oeve.getSource().getRows()[i].getCells()[11].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].Cr_Time;
				$("#" + oeve.getSource().getRows()[i].getCells()[12].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].Ap_Time;
				$("#" + oeve.getSource().getRows()[i].getCells()[13].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].As_Time;
				$("#" + oeve.getSource().getRows()[i].getCells()[14].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].Pe_Time;
				$("#" + oeve.getSource().getRows()[i].getCells()[15].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].In_Time;
				$("#" + oeve.getSource().getRows()[i].getCells()[16].sId + " svg text")[0].innerHTML = oeve.getSource().getModel("oLocalJsonModel").getProperty("/VehTableset")[oeve.getSource().getFirstVisibleRow() + i].Iv_Time;
			}

		},
		onExit: function () {

			if (this._ValueReassignJCB) {
				this._ValueReassignJCB.destroy(true);
				this.getView().removeDependent(this._ValueReassignJCB);
			}
			if (this._ValueUnAssignROJCB) {
				this._ValueUnAssignROJCB.destroy(true);
				this.getView().removeDependent(this._ValueUnAssignROJCB);
			}

		},
		_ReadQICount:function(){
			var that = this;
			that.oBusyDialog.open();
			var oSuccessQIDONE = function (oData) {
				that.oBusyDialog.close();
				// oData.results.unshift({})
				

				that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/QIDONECOUNT", oData.results.length);


			};
			var oErrorQIDONE = function (err) {
				that.oBusyDialog.close();

				sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
			};
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/QI_DONESet", {
				success: oSuccessQIDONE,
				error: oErrorQIDONE
			});
		},
		onPressTagQIDone:function(){
			if (!this._QIDoneDialog) {
				this._QIDoneDialog = sap.ui.xmlfragment("comZJCB.fragment.QIDone", this);
				this.getView().addDependent(this._QIDoneDialog);
			}
			this._QIDoneDialog.open();
			sap.ui.getCore().byId("QIDoneList").getBinding("items").filter([])
this.getView().getModel("ZSVC_JCB_SRV").refresh(true);
sap.ui.getCore().byId("QIDoneList").getBinding("items").refresh(true);
		},

		onPressQIDoneCancel:function(){
			/*this._QIDoneDialog.close();
			this._QIDoneDialog.destroy()
			this._QIDoneDialog= null;*/
		},
		onPressQiWorkComplete:function(oEvent){
			var that = this;
			that.oBusyDialog.open();
			var SelectedJCobj = {};
			//var SelectedArr = sap.ui.getCore().byId("QIDoneList").getSelectedItems();
			var SelectedArr = oEvent.getParameter("selectedContexts");
			var SelectedJCArr =[];
			//te
			if(SelectedArr.length === 0){
				that.oBusyDialog.close();
				sap.m.MessageBox.error("Please select at least one item");
				return;
			}
			for(var i=0;i<SelectedArr.length;i++){
				var obj1 ={};
			//	obj1 = SelectedArr[i].getBindingContext("ZSVC_JCB_SRV").getObject();
			   obj1 = SelectedArr[i].getObject();
				delete obj1.__metadata;
				SelectedJCArr.push(obj1);
			}
			SelectedJCobj.JC_NUM = SelectedJCArr[0].JC_NUM;
			SelectedJCobj.QI_DONE_NAV = SelectedJCArr;
			that.getOwnerComponent().getModel("ZSVC_JCB_SRV").create("/QI_DONE_HDRSet", SelectedJCobj, {
				success: function (oData) {
					that.oBusyDialog.close();
					that._Readinvocecount();
					that._ReadQICount();
					//that.onPressQIDoneCancel();
					if(oData.MSG !== ""){
						if (!that.MsgDispDialog) {
							that.MsgDispDialog = sap.ui.xmlfragment("comZJCB.fragment.MessageDisp", that);
							that.getView().addDependent(that.MsgDispDialog);
						}
						that.MsgDispDialog.open();
                 var MsgArr = oData.MSG.split("*");
				 var oModel = new sap.ui.model.json.JSONModel(MsgArr);
				 that.getView().setModel(oModel,"MsgModel");
					}
// 					sap.ui.getCore().byId("QIDoneList").getBinding("items").filter([])
// this.getView().getModel("ZSVC_JCB_SRV").refresh(true);
// sap.ui.getCore().byId("QIDoneList").getBinding("items").refresh(true);
				},
				error:function(err){	
						that.oBusyDialog.close();
						sap.m.MessageBox.show(err.responseText, sap.m.MessageBox.Icon.ERROR, "Error");
					
				}
			});
		},
		onPressMsgok:function(){
             this.MsgDispDialog.close();
			 this.MsgDispDialog.destroy();
			 this.MsgDispDialog = null;
		},

		onhandleQIJcPress:function(oEvent){
			var Data = oEvent.getSource().getBindingContext("ZSVC_JCB_SRV").getObject();
			//this.onPressQIDoneCancel();
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var o = sap.ushell.Container.getService("CrossApplicationNavigation");
				var n = o.hrefForExternal({
					target: {
						semanticObject: "Z_JCP",
						action: "display"
					},
					params: {
						action: "JCB_JOBCARDDETAIL",
						Job_card: Data.JC_NUM,
						VINNumber: Data.VHVIN,

					}
				}) || "";
				var i = window.location.href.split("#")[0] + n;
				sap.m.URLHelper.redirect(i, true)
		}
	},
	_Readinvocecount:function(){
		var that=this;
		that.oBusyDialog.open();
		var oSuccess = function(oData) {
			that.oBusyDialog.close();
			that.getOwnerComponent().getModel("oLocalJsonModel").setProperty("/CountDatasetinvoice", oData);
		
		};
		var oError = function(err) {
			that.oBusyDialog.close();

			sap.m.MessageBox.show(JSON.parse(err.responseText), sap.m.MessageBox.Icon.ERROR, "Error");
		};

		that.getOwnerComponent().getModel("ZSVC_JCB_SRV").read("/CountSet('')", {
			success: oSuccess,
			error: oError
		});
	}

	});
});