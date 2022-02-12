
import React,{useRef, useEffect} from 'react'
import { loadModules } from "esri-loader";



function Map() {
  const MapEl= useRef(null)
  
  useEffect(
    ()=>{
      let view
      loadModules([
        "esri/views/MapView",
        "esri/WebMap", 
        "esri/layers/FeatureLayer",
        "esri/widgets/Directions"
      ],{
        css:true
      }).then(([
        MapView, 
        WebMap, 
        FeatureLayer, 
        Directions])=>{

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
        let directionsWidget = new Directions({
          
          view: view,
           routeServiceUrl: "https://sig.simur.gov.co/arcgis/rest/services/MVI_REDBICI/NARedBici/NAServer/Avanzado"
           
        })

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
        <div style={{height:1200 }} ref={MapEl}></div>
      )
       
  }

export default Map;