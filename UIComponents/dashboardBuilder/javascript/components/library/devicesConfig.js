const __onQueryChange__ = function (modelValue, form, model) {
    console.log(modelValue)
}
const __onDevicesChange__ = function (modelValue, form, model, scope) {
    var historicalCharts = ["dygraphs", "line", "bar", "area", "windrose", "d3surface"];
    model.query[form.key[1]].sensor = null;
    if(historicalCharts.indexOf(model["type"]) > -1 ) {
        model["api"] = "app/api/getDeviceSensorsHistory";
    } else {
        model["api"] = "app/api/getDeviceSensorsLatest";
    }
    model["transport"] = "https";
    
    console.log("On Devices Change", modelValue, form, model, scope);
}
const __onAttributesChange__ = function(modelValue, form, model, scope) {
    //var sensors =  _.pluck(modelValue, "id");
    var query = [];
	console.log("On Attributes Change", modelValue, form, model, scope);
    
    //Build Y keys from query model
    var ykeys = [];
	_.forEach(model["query"], function(entry, index) {
        if(index !== form.key[1]) {
             query[index] = {"sensor": entry.sensor, "device": entry.device};
            _.forEach(entry.sensor, function(sensor) {
                var tmp = entry.device + "-" + sensor;
                if(ykeys.indexOf(tmp) == -1) {
                    ykeys.push(tmp);
                }
          })
        } else {
             var curr = {"sensor": []};
            _.forEach(modelValue, function(sensor) {
                var tmp = sensor.device + "-" + sensor.value;
                curr["sensor"].push(sensor.value);
                curr["device"] = sensor.device;
                if(ykeys.indexOf(tmp) == -1) {
                    ykeys.push(tmp);
                }
            })
            
            query.push(curr)
        }
      
	});
    
    model["api-params"] = JSON.stringify({"query": query, "format": model["data-format"] })
    
    if(model["type"] == "line" || model["type"] == "area" || model["type"] == "bar") {
        var defaultColors = [ "#CC5464", "#FCC717", "#38B9D6", "#1DBC68", "#E90088", "#1B1B1B", "#2243B6", "#299617", "#FF3855", "#FFDB00", "#AF6E4D", "#5946B2", "#FF9966", "#FF007C", "#BFAFB2", "#5DADEC", "#A7F432", "#FA5B3D", "#A83731", "#9C51B6", "#EE34D2", "#0A7E8C", "#FFD12A", "#76D7EA", "#84DE02"];
        var oldColorsMapping = {};
        var colorsMapping = model["yconfig"];
        for(var c=0; c<colorsMapping.length; c++){
            if(colorsMapping[c].key)
                oldColorsMapping[colorsMapping[c].key] = {"label": colorsMapping[c].label, "color": colorsMapping[c].color, "unit": colorsMapping[c].unit}; 
        }
        var newMapping = [];
        for (var i=0; i<ykeys.length; i++){
            if(oldColorsMapping[ykeys[i]]){
                newMapping.push({"key": ykeys[i], "label": oldColorsMapping[ykeys[i]]["label"], "color": oldColorsMapping[ykeys[i]]["color"], "unit": oldColorsMapping[ykeys[i]]["unit"]}); 
            }else{
                for(var t=0; t<defaultColors.length; t++){
                    var selectedColorFound = false;
                    var currentColor = defaultColors[t];
                    for(var h=0; h<newMapping.length; h++){
                        var newMappingColor = newMapping[h].colors;
                        if(newMappingColor == currentColor){
                            selectedColorFound = true;
                            break;
                        }
                    }
                    if(!selectedColorFound){
                        break;
                    }
                }
                 newMapping.push({"key": ykeys[i], "label": ykeys[i], "color": !selectedColorFound ? defaultColors[t] : defaultColors[0], "unit": ""});  
                 
            }
        }
        if(newMapping.length == 0)
            newMapping = [{}];
        model["yconfig"] = newMapping;
        model["xkey"] = "creationDate"
    }
    if(model["type"] == "dygraphs") {
        //model["on-format-data"] = 'var formattedData = [];  \r\n_.each(data, function(entry){ \r\n    var tmp = [];\r\n    tmp.push(new Date(entry[\"creationDate\"]));\r\n    _.each(entry, function(value,key){ \r\n        if(key != \"creationDate\") {\r\n            tmp.push(parseFloat(value));\r\n            formattedData.push(tmp);\r\n        }\r\n      });\r\n    \t\r\n});\r\nreturn formattedData;'
        var defaultColors = [ "#CC5464", "#FCC717", "#38B9D6", "#1DBC68", "#E90088", "#1B1B1B", "#2243B6", "#299617", "#FF3855", "#FFDB00", "#AF6E4D", "#5946B2", "#FF9966", "#FF007C", "#BFAFB2", "#5DADEC", "#A7F432", "#FA5B3D", "#A83731", "#9C51B6", "#EE34D2", "#0A7E8C", "#FFD12A", "#76D7EA", "#84DE02"];
        var oldColorsMapping = {};
        var colorsMapping = model["colors-mapping"];
        for(var c=0; c<colorsMapping.length; c++){
            if(colorsMapping[c].ykeys)
                oldColorsMapping[colorsMapping[c].ykeys] = {"labels": colorsMapping[c].labels, "colors": colorsMapping[c].colors, "axisSelection": colorsMapping[c].axisSelection, "unit": colorsMapping[c].unit};
        }
        var newMapping = [];
        for (var i=0; i<ykeys.length; i++){
            if(oldColorsMapping[ykeys[i]]){
                newMapping.push({"ykeys": ykeys[i], "labels": oldColorsMapping[ykeys[i]]["labels"], "colors": oldColorsMapping[ykeys[i]]["colors"], "axisSelection": oldColorsMapping[ykeys[i]]["axisSelection"], "unit": oldColorsMapping[ykeys[i]]["unit"]});
            }else{
                for(var t=0; t<defaultColors.length; t++){
                    var selectedColorFound = false;
                    var currentColor = defaultColors[t];
                    for(var h=0; h<newMapping.length; h++){
                        var newMappingColor = newMapping[h].colors;
                        if(newMappingColor == currentColor){
                            selectedColorFound = true;
                            break;
                        }
                    }
                    if(!selectedColorFound){
                        break;
                    }
                }
                newMapping.push({"ykeys": ykeys[i], "labels": ykeys[i], "colors": !selectedColorFound ? defaultColors[t] : defaultColors[0], "axisSelection": "y", "unit": ""});    
            }
        }
        if(newMapping.length == 0)
            newMapping = [{}];
        model["colors-mapping"] = newMapping;
        var legendMappingValue = '["x",';
        var legendLabelsValue = '["X",';
        for (var i=0; i<ykeys.length; i++){
            legendMappingValue += "'y'" + ((i < ykeys.length - 1)?' , ':'');
            legendLabelsValue += '"' + (ykeys[i]) + '"' + ((i < ykeys.length - 1)?' , ':'');
        }
        model["legend-labels"] = legendLabelsValue + "]";
        model["legend-mapping"] = legendMappingValue + "]"; 
    }
    //sensors.push("creationDate");
}
angular
    .module('DashboardBuilder')
    .constant(
    "devicesConfig",
    {
        "formTab": {
            title: "Devices",
            items: [
                { 
                    "type" : "section",
                    "htmlClass" : "row",
                    "title" : "Device",
                    "placeholder" : " ",
                    "items" : [
                        {
                           // "type" : "section",
                            "htmlClass" : "col-xs-12",
                            //"items": [{
                                "key": "query",
                                "title": "Select devices & corresponding attributes",
                                "startEmpty": true,
                                "onChange": __onQueryChange__,
                                /**"items": [{
                                    "type": "section",
                                    "htmlClass": "col-xs-12",
                                    "items": [
                                        {
                                            "type" : "section",
                                            "htmlClass" : "col-xs-12",**/
                                            "items": [
                                                {
                                                    //"type" : "section",
                                                    "htmlClass" : "col-xs-6",   
                                                    //"items": [
                                                      //  {
                                                            "key": "query[].device",
                                                            "type": 'uiselect',
                                                            "placeholder": "Select device",
                                                            "options": {
                                                                "closeOnSelect": true,
                                                                "callback": "loadDevicesCallback",
                                                                "map": {valueProperty: "id", nameProperty: "id"}
                                                            },
                                                            "onChange": __onDevicesChange__
                                                      //  }
                                                    //]
                                                },
                                                {
                                                    //"type" : "section",
                                                    "htmlClass" : "col-xs-6",   
                                                    //"items": [
                                                      //  {
                                                            "key": "query[].sensor",
                                                            "type": 'uiselectmultiple',
                                                            "placeholder": "Select device attributes",
                                                            "options": {
                                                                "multiple": true,
                                                                "closeOnSelect": true,
                                                                "callback": "loadDeviceSensorsCallback",
                                                                "map": {valueProperty: "value", nameProperty: "name", deviceProperty: "device"},
                                                                "filterTriggers": ["model.query[form.key[1]].device"],
                                                                "filter": "model.query[form.key[1]].device == item.device"
                                                            },
                                                            "onChange": __onAttributesChange__
                                                        }
                                                    ]
                                                /**}
                                            ]**/
                                       /** }]
                                }
                                         ]**/
                           // }
                                  //   ]
                        }]}]}
        ,
        "schemaFields": {
            "identifyKeys": {
                "type": "hidden"
            },
            "query": {
                "type": "array",
                "default": [],
                "items": {
                    "type": "object",
                    "properties": {
                        "device": {
                            "title": "Device Identifier",
                            "type": "string",
                            "placeholder" : " ",
                            "description": "Select device."
                        },
                        "sensor": {
                            "type": "array",
                            "title": "Device Attributes",
                            "description": "Select your device attributes",
                            "items": {
                                "type": "object"
                            }
                        }
                    }
                }
            }
        }
    }
);
/**
                        {
                                "type": "section",
                                "htmlClass": "row",
                                "items": [
                                    {
                                        "type" : "section",
                                        "htmlClass" : "col-xs-6",
                                        "items": [{
                                            "key": "device",
                                            "type": 'uiselect',
                                            "placeholder": "",
                                            "options": {
                                                "closeOnSelect": true,
                                                "callback": "loadDevicesCallback",
                                                "map": {valueProperty: "id", nameProperty: "id"}
                                            },
                                            "onChange": __onDevicesChange__ 
                                        }]
                                    },
                                    {
                                        "type" : "section",
                                        "htmlClass" : "col-xs-6",   
                                        "items": [
                                            {"key": "sensor",
                                            "type": 'uiselectmultiple',
                                            "placeholder": "",
                                            "options": {
                                                "multiple": true,
                                                "closeOnSelect": true,
                                                "callback": "loadDeviceSensorsCallback",
                                                "map": {valueProperty: "value", nameProperty: "name"},
                                                "filterTriggers": ["model.device"],
                                                "filter": "model.device == item.device"
                                            },
                                            "onChange": __onAttributesChange__
                                            }
                                        ]
                                    }
                                ]
                        }**/
