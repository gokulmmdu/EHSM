sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("ehsmportal.controller.Dashboard", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDashboard").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function () {
                var oUserModel = this.getOwnerComponent().getModel("userSession");
                if (!oUserModel) {
                    // No user session, redirect to login
                    this.getOwnerComponent().getRouter().navTo("RouteLogin");
                    return;
                }

                var sEmployeeId = oUserModel.getProperty("/EmployeeId");
                this._filterTables(sEmployeeId);
            },

            _filterTables: function (sEmployeeId) {
                var aFilters = [];
                if (sEmployeeId) {
                    aFilters.push(new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId));
                }

                // Filter Incident Table
                var oIncidentTable = this.byId("incidentsTable");
                var oIncidentBinding = oIncidentTable.getBinding("items");
                if (oIncidentBinding) {
                    oIncidentBinding.filter(aFilters);
                }

                // Filter Risk Table
                var oRiskTable = this.byId("risksTable");
                var oRiskBinding = oRiskTable.getBinding("items");
                if (oRiskBinding) {
                    oRiskBinding.filter(aFilters);
                }
            },

            onNavBack: function () {
                // Since this is the "Home" after login, back might mean logout or just stay.
                // We'll implement Logout explicitly.
                this.onLogout();
            },

            onLogout: function () {
                this.getOwnerComponent().setModel(null, "userSession");
                this.getOwnerComponent().getRouter().navTo("RouteLogin");
                MessageToast.show("Logged out");
            },

            onFilterIncidents: function (oEvent) {
                // Combine EmployeeId filter with search query if needed
                // For now, simpler implementation: just search on description or ID?
                // The requirement specifically asked for filtering by EmployeeID.
                // This search field is an "extra" UI element I added.
                // Keeping it simple for now -> Maybe filter by Description locally to what's already fetched?
                // Or re-trigger OData filter?
                // Let's rely on the main requirement: Filter by EmployeeID.
                // If I add more filters, I need to combine them.

                var sQuery = oEvent.getParameter("query");
                var oUserModel = this.getOwnerComponent().getModel("userSession");
                var sEmployeeId = oUserModel ? oUserModel.getProperty("/EmployeeId") : "";

                var aFilters = [];
                if (sEmployeeId) {
                    aFilters.push(new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId));
                }

                if (sQuery) {
                    aFilters.push(new Filter("Description", FilterOperator.Contains, sQuery));
                }

                var oTable = this.byId("incidentsTable");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);
            }
        });
    });
