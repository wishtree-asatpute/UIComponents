var underscore = angular.module("underscore", []);
underscore.factory("_", ["$window", function($window) {		
  return $window._; // assumes underscore has already been loaded on the page		
}]);



angular.module("DashboardBuilder", [
	"underscore", 
	"btford.markdown", 
	"schemaForm", 
	"Accelerometer", 
	"IFrame", 
	"Button", 
	"Slider", 
	"ToggleSwitch", 
	"ACL", 
	"Grid", 
	"Map", 
	"Alert", 
	"xeditable", 
	"ui.bootstrap", 
	"ngRoute", 
	"slickCarousel", 
	"ngAnimate", 
	"ngSanitize", 
	"WsClient", 
	"HttpClient", 
	"DataService", 
	"Chart", 
	"gridster",
	"Gauge",
    "Grideye",
	"Speedometer", 
	"Odometer",
	"SearchBox", 
	"ngMaterial", 
	"ngMessages", 
	"material.svgAssetsCache", 
	"Thermometer", 
	"angularSpectrumColorpicker",
	"angular-underscore/filters", 
	"ui.codemirror",  
	"Dygraphs", 
	"mgcrea.ngStrap", 
	"mgcrea.ngStrap.modal",
    "pascalprecht.translate",
    'ui.select', 
    'ui.highlight',
    'mgcrea.ngStrap.select',
	"Display", 
	"Plotly",
    "ngSchemaFormFile"
]);