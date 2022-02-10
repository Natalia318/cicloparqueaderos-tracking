
import React,{useRef, useEffect} from 'react'
import { loadModules } from "esri-loader";

function Map() {
  const MapEl= useRef(null)
  
  useEffect(
    ()=>{
      let view
      loadModules(["esri/views/MapView","esri/WebMap", "esri/layers/FeatureLayer","esri/widgets/Directions"],{
        css:true
      }).then(([MapView, WebMap, FeatureLayer, Directions])=>{
        const webmap = new WebMap({
          basemap: 'arcgis-navigation'
        });
         view = new MapView({
           map:webmap,
           center:[-74.08775, 4.60971],
           zoom: 12 ,
           container: MapEl.current

         });
         const popupBiciParqueaderos = {
          "title": "Bici Parqueaderos",
          "content": "<b>Nombre:</b> {NOMBRE_CICP}<br> <b>Horario:</b> {HORARIO_CICP}<br><b>DIRECCION:</b> {DIRECCION}<br><b>LOCALIDAD :</b> {LOCALIDAD }<br><b>CUPOS :</b> {CUPOS} ft"
        }

         const BiciParqueaderos = new FeatureLayer({
          url: "https://services2.arcgis.com/NEwhEo9GGSHXcRXV/arcgis/rest/services/Cicloparqueaderos_Certificados_Bogota_D_C/FeatureServer/0",
          outFields: ["NOMBRE_CICP","HORARIO_CICP","DIRECCION","LOCALIDAD","CUPOS"],
          popupTemplate: popupBiciParqueaderos
        });
      
        webmap.add(BiciParqueaderos);

        const cicloRuta = new FeatureLayer({
          url: "https://sig.simur.gov.co/arcgis/rest/services/MVI_REDBICI/NARedBici/NAServer/",
          
        });
      
        webmap.add(cicloRuta,1 );

        let directionsWidget = new Directions({
          view: view,
          apiKey:  "AAPKc0b8ba2631154c479397b7b54ef30a317KkDtiXgQNidqHbd_SP-sm7BdeGE5jQ-mGWnCAgLB7dFTkGEXcLLe6SZHFRpr14m"
        });
        // Adds the Directions widget below other elements in
        // the top right corner of the view
        view.ui.add(directionsWidget, {
          position: "top-right",
          index: 2
        });

        
      })
      return()=>{
        if (!!view) {
          view.destroy()
          view=null
        } 
      }
    })
      return(
        <div style={{height:1300 }} ref={MapEl}></div>
      )
       
  }

export default Map;