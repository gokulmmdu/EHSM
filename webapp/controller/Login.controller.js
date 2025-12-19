sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("ehsmportal.controller.Login", {
            onInit: function () {
                var oData = {
                    EmployeeId: "",
                    Password: ""
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "loginModel");
            },

            onLoginPress: function () {
                var oLoginData = this.getView().getModel("loginModel").getData();
                var sEmployeeId = oLoginData.EmployeeId;
                var sPassword = oLoginData.Password;

                if (!sEmployeeId || !sPassword) {
                    MessageToast.show("Please enter both Employee ID and Password.");
                    return;
                }

                var oModel = this.getOwnerComponent().getModel();
                var sPath = "/loginSet(EmployeeId='" + sEmployeeId + "',Password='" + sPassword + "')";

                // Show busy indicator
                sap.ui.core.BusyIndicator.show();

                oModel.read(sPath, {
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        // Assume any successful read means valid credentials.
                        // In a real scenario, we might check a property in oData.
                        MessageToast.show("Login Successful");
                        
                        // Store the Logged in User ID in a global model/Component for other views to use
                        this.getOwnerComponent().setModel(new JSONModel({ EmployeeId: sEmployeeId }), "userSession");

                        this.getOwnerComponent().getRouter().navTo("RouteDashboard");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        try {
                            var oResponse = JSON.parse(oError.responseText);
                            MessageToast.show(oResponse.error.message.value);
                        } catch (e) {
                             MessageToast.show("Login Failed. Please check credentials.");
                        }
                    }
                });
            }
        });
    });
