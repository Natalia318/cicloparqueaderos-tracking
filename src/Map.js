
import React,{useRef,useEffect} from 'react'
import { loadModules } from "esri-loader";
import './App.css';



function Map() {
 const MapEl =useRef(null)
  
  useEffect(
    ()=>{
      let view
      loadModules([
        "esri/views/MapView",
        "esri/WebMap", 
        "esri/layers/FeatureLayer",
        //"esri/widgets/Directions",
       
        "esri/Graphic",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet"
       


      ],{
        css:true
      }).then(([MapView, WebMap, FeatureLayer,Graphic, route, RouteParameters, FeatureSet])=>{

        const webmap = new WebMap({
          basemap: 'arcgis-navigation'
        });

         view = new MapView({
           map:webmap,
           center:[-74.08775, 4.60971],
           zoom: 12 ,
           container: MapEl.current

         });
         //información bici parqueaderos
         const popupBiciParqueaderos = {
          "title": "Bici Parqueaderos",
          "content": "<b>Nombre:</b> {NOMBRE_CICP}<br> <b>Horario:</b> {HORARIO_CICP}<br><b>DIRECCION:</b> {DIRECCION}<br><b>LOCALIDAD :</b> {LOCALIDAD }<br><b>CUPOS :</b> {CUPOS} ft"
        }
         
        //capa bici parqueaderos
         const BiciParqueaderos = new FeatureLayer({
          url: "https://services2.arcgis.com/NEwhEo9GGSHXcRXV/arcgis/rest/services/Cicloparqueaderos_Certificados_Bogota_D_C/FeatureServer/0",
          outFields: ["NOMBRE_CICP","HORARIO_CICP","DIRECCION","LOCALIDAD","CUPOS"],
          popupTemplate: popupBiciParqueaderos
        });
      
        webmap.add(BiciParqueaderos);

        //ruta de ciclovia
       
        const routeUrl = "https://sig.simur.gov.co/arcgis/rest/services/MVI_REDBICI/NARedBici/NAServer/Avanzado";
        view.on("click", function(event){
          if (view.graphics.length === 0) {
            addGraphic("origin", event.mapPoint);
          } else if (view.graphics.length === 1) {
            addGraphic("destination", event.mapPoint);
            getRoute(); // Call the route service
          } else {
            view.graphics.removeAll();
            addGraphic("origin",event.mapPoint);
          }
  
        });
  
        function addGraphic(type, point) {
          const graphic = new Graphic({
            symbol: {
              type: "simple-marker",
              color: (type === "origin") ? "white" : "black",
              size: "8px"
            },
            geometry: point
          });
          view.graphics.add(graphic);
        }
        function getRoute() {
          const routeParams = new RouteParameters({
            stops: new FeatureSet({
              features: view.graphics.toArray()
            }),
            returnDirections: true
          });
          route.solve(routeUrl, routeParams)
          .then(function(data) {
            data.routeResults.forEach(function(result) {
              result.route.symbol = {
                type: "simple-line",
                color: [5, 150, 255],
                width: 3
              };
              view.graphics.add(result.route);
              });
  
              // Display directions
              if (data.routeResults.length > 0) {
                const directions = document.createElement("ol");
                directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                directions.style.marginTop = "0";
                directions.style.padding = "15px 15px 15px 30px";
                const features = data.routeResults[0].directions.features;
  
                // Show each direction
                features.forEach(function(result,i){
                  const direction = document.createElement("li");
                  direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                  directions.appendChild(direction);
                });
                view.ui.empty("top-right");
                view.ui.add(directions, "top-right");
  
              }
  
          }).catch(function(error){
            console.log(error) })
         
        }  

    
      })
      return()=>{
        if (!!view) {
          view.destroy()
          view=null
        } 
      }
    })
      return(
        <div id="viewDiv" style={{height:1000}} ref={MapEl}></div>
      )
       
  }

export default Map;