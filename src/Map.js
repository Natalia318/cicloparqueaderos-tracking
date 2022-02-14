import React,{useRef, useEffect} from 'react'
import { loadModules } from "esri-loader";

function Map() {
  const MapEl= useRef(null)
  
  useEffect(
    ()=>{
      let view
      loadModules(["esri/views/MapView","esri/WebMap", "esri/layers/FeatureLayer", "esri/widgets/Directions", "esri/layers/MapImageLayer"],{
        css:true
      }).then(([MapView, WebMap, FeatureLayer, Directions, MapImageLayer])=>{
        
        const webmap = new WebMap({
          basemap: 'arcgis-navigation'
        });
         view = new MapView({
           map:webmap,
           center:[-74.08175,4.60971],
           zoom: 11 ,
           container: MapEl.current

         });

         const layer = new MapImageLayer({ url: "https://sig.simur.gov.co/arcgis/rest/services/Cicloinfraestructura/CiclonInfraestructura/MapServer" });
         webmap.add(layer);  // adds the layer to the map
      
         
         
        let directionsWidget = new Directions({
          view: view,
          apiKey: "AAPKb0e63d6ceba0453e8f9ecbcc8418e3d5ToX8ofsrUmEVbq31LkUvIpu0PYw5Fb3K65e4AGqlr33p0W84RqfmnqXV8L66TyJ6"
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
        <div style={{height:1200}} ref={MapEl}></div>
      )
       
  }

export default Map;
