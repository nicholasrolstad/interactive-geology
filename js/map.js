// GEOLOGIC UNITS

//set style for geologic units
function unitStyle(feature) {
	var newCol = '#' + feature.properties.HEX;
    return {
        fillColor: newCol,
        opacity: 1,
        fillOpacity: .98,
        color: '#111111',
        weight: .5
    };
}

//set style for hidden geologic units
function invisibleUnits(feature) {
	var newCol = '#' + feature.properties.HEX;
    return {
        fillColor: newCol,
        opacity: 0,
        fillOpacity: 0,
        color: '#111111',
        weight: 0
    };
}

//geo layer hover
var geo;
var faultLayer;
var CSLayer;

function highlightUnit(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: 'black',
        dashArray: '',
        strokeOpacity: 1,
        fillOpacity: .75
    });

}

function resetUnit(e) {
    geo.resetStyle(e.target);
}

//unit symbol pop-up
var symbPopUp;
function unitPopUp(feature, layer) {
    layer.on({
        mouseover: highlightUnit,
        mouseout: resetUnit,
    });
    if (feature.properties && feature.properties.UNITSYMBOL) {
        symbPopUp = feature.properties.UNITSYMBOL
        layer.bindPopup("<img src=\'images/"+ symbPopUp +".jpg\'>", {
            className: "symbPop"
        });
    }
}



// Faults
function getDash(d) {
	return d == 'approximately located' ? '3,3' :
		d == 'concealed' ? '1,5' :
		d == 'well located' ? '' :
    '';
}

// Faults style
function faultStyle(feature) {
    return {
        opacity: 1,
        color: 'black',
        dashArray: getDash(feature.properties.MODIFIER),
        weight: 1
    };
}

// CS style
function CSStyle(feature) {
    return {
        opacity: 1,
        color: 'black',
        weight: 4
    };
}





geo = L.geoJson(units, {
    style: unitStyle,
    onEachFeature: unitPopUp
})

faultLayer = L.geoJson(faults, {
	style: faultStyle
})


CSLayer = L.geoJson(crosssections, {
	style: CSStyle,
	onEachFeature: CSPopUp
})


// Cross Section 'Pop Up'
var csPop;
function CSPopUp(feature, layer) {
	layer.on('click', function(e) {
		if (document.getElementById("crossSectionDiv").className != 'hor-scroll') {
			document.getElementById("crossSectionDiv").className = 'hor-scroll';
			document.getElementById("map-container").className = 'mapShrink';
			setTimeout(function(){ map.invalidateSize()}, 400);
		}
		
		
		
		if (feature.properties && feature.properties.NOTES) {
			csPop = feature.properties.NOTES;
			document.getElementById("crossSectionDiv").innerHTML = "<img src=\"images/" + csPop + ".jpg\" class=\"cross-section\">";
		}
	});
}








//map
mapLink = '<a href="https://www.mapbox.com/">Mapbox</a>';

var terrain = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlkd2VzdGNvYXN0IiwiYSI6ImNpd3F6djN5ZTAxY3Yyb3BmM2Z4dzlrd2UifQ.ad4-hQvgRhK2ETritdMAYw', {id: 'MapID', attribution: '&copy; ' + mapLink + ' Nicholas Rolstad 2017'})

var sat = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlkd2VzdGNvYXN0IiwiYSI6ImNpd3F6djN5ZTAxY3Yyb3BmM2Z4dzlrd2UifQ.ad4-hQvgRhK2ETritdMAYw', {id: 'MapID', attribution: '&copy; ' + mapLink + ' Nicholas Rolstad 2017 +++ All Geological Data from Utah Geological Survey Tule Valley & Wah Wah North 30x60 Geologic Maps'})

//initiate map
var map = L.map('map', {
    center: [39.28, -113.44],
    zoom: 11,
    layers: [sat, geo, faultLayer, CSLayer],
	inertia: false
});

var baseMaps = {
    "Terrain": terrain,
    "Satellite": sat,
};

//add all layers to map
L.control.layers(baseMaps).addTo(map);



//jQuery document ready function
$(function(){
	//Hide geologic units button
	$("#btn1").parent().on("click","#btn1", function () {
		map.removeLayer(geo);
		geo = L.geoJson(units, {
			style: invisibleUnits,
			onEachFeature: unitPopUp
		})
		map.addLayer(geo);
		$("#btn1").val("Show Geologic Units");
		$("#btn1").attr("id", "btn2");
		if (map.hasLayer(CSLayer) == true) {
			map.removeLayer(CSLayer);
			map.addLayer(CSLayer);
		};
	});
	//Make geologic units visible button
	$("#btn1").parent().on("click","#btn2",function () {
		map.removeLayer(geo);
		geo = L.geoJson(units, {
			style: unitStyle,
			onEachFeature: unitPopUp
		})
		map.addLayer(geo);
		$("#btn2").val("Hide Geologic Units");
		$("#btn2").attr("id", "btn1");
		if (map.hasLayer(faultLayer) == true) {
			map.removeLayer(faultLayer);
			map.addLayer(faultLayer);
		};
		if (map.hasLayer(CSLayer) == true) {
			map.removeLayer(CSLayer);
			map.addLayer(CSLayer);
		};
	});
	
	$("#fs1").parent().on("click","#fs1", function () {
		map.toggleFullscreen();
	});
	
	
	//Hide faults button
	$("#hf1").parent().on("click","#hf1", function () {
		map.removeLayer(faultLayer);
		$("#hf1").val("Show Faults");
		$("#hf1").attr("id", "hf2");
	});
	//Show faults button
	$("#hf1").parent().on("click","#hf2",function () {
		map.addLayer(faultLayer);
		$("#hf2").val("Hide Faults");
		$("#hf2").attr("id", "hf1");
	});
	
		//Hide Cross-Section button
	$("#cs1").parent().on("click","#cs1", function () {
		map.removeLayer(CSLayer);
		$("#cs1").val("Show Cross-Sections");
		$("#cs1").attr("id", "cs2");
		if (document.getElementById("crossSectionDiv").className == 'hor-scroll') {
			document.getElementById("crossSectionDiv").className = '';
			document.getElementById("crossSectionDiv").innerHTML = '';
			document.getElementById("map-container").className = 'full';
			setTimeout(function(){ map.invalidateSize()}, 400);
		}
	});
	//Show Cross-Section button
	$("#cs1").parent().on("click","#cs2",function () {
		map.addLayer(CSLayer);
		$("#cs2").val("Hide Cross-Sections");
		$("#cs2").attr("id", "cs1");
	});
	
});
	
	


