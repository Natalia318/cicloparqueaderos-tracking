import {useEffect} from 'react'
import { loadModules } from 'esri-loader';


function Route() {
  
    
  useEffect(()=>{
    let view

    loadModules([
    "esri/Graphic",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet"
    ]).then(([Graphic, route, RouteParameters, FeatureSet])=>{

       

     
      const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
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

        })
       
      }return()=>{
          if (!!view) {
            view.destroy()
            view=null
          } 
        }
      
    }) 
           return null
  })
}

export default Route;