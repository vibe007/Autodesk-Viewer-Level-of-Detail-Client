  ///////////////////////////////////////////////////////////////////////////////
  // Demo Workshop Viewer Extension
  // by Philippe Leefsma, April 2015
  // //MULTI URN
  ///////////////////////////////////////////////////////////////////////////////

  AutodeskNamespace("Viewing.Extension");

  Viewing.Extension.Workshop = function (viewer, options) {

    /////////////////////////////////////////////////////////////////
    //  base class constructor
    //
    /////////////////////////////////////////////////////////////////

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _self = this;
    var _viewer = viewer;
    var _curID = 2;
    var _ctr = 0;
    var _fpsAr = [];
    var _sum = 0;
    var _space = 200;
    //var _URNs = [
    //'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE2LTA2LTI5LTIzLTI4LTM3LTJxdjBzNXVnbXVibWNleTAwMGdyMmhndDNibmYvYXJtYWRpbGxvXzUxODkwXzYwLm9iag==',
    //'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE2LTA2LTI5LTIzLTI4LTMyLTJxdjBzNXVnbXVibWNleTAwMGdyMmhndDNibmYvYXJtYWRpbGxvXzc3ODM0XzkwLm9iag==',
    //'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE2LTA2LTI5LTIzLTI4LTM5LTJxdjBzNXVnbXVibWNleTAwMGdyMmhndDNibmYvYXJtYWRpbGxvXzI1OTQ1XzMwLm9iag=='];
    var _URNs = [];
    var templateURN = '';
    var LODs = ['1', '5', '10', '50', '75'];


    /////////////////////////////////////////////////////////////////
    // creates panel and sets up inheritance
    //
    /////////////////////////////////////////////////////////////////

    Viewing.Extension.Workshop.WorkshopPanel = function(
      parentContainer,
      id,
      title,
      options)
    {
      Autodesk.Viewing.UI.PropertyPanel.call(
        this,
        parentContainer,
        id, title);
    };

    Viewing.Extension.Workshop.WorkshopPanel.prototype = Object.create(
      Autodesk.Viewing.UI.PropertyPanel.prototype);

    Viewing.Extension.Workshop.WorkshopPanel.prototype.constructor =
      Viewing.Extension.Workshop.WorkshopPanel;

    /////////////////////////////////////////////////////////////////
    // load callback: invoked when viewer.loadExtension is called
    //
    /////////////////////////////////////////////////////////////////

    _self.load = function () {
      //Try every 5 seconds, change the LOD representation. Use Set interval. 
      //Say not able to get the numerical speed up in frame rate, getting 404 error
      //when setting environment to staging instead of prod. Prod might have debugging tools w/
      //statistics and fps. Email Philippe/post on LMV slack. 
      _viewer.initDebugTools();
      _viewer.addEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      _self.onSelectionChanged); //change the event listener

      _self.panel = new Viewing.Extension.Workshop.WorkshopPanel (
        _viewer.container,
        'WorkshopPanelId',
        'Workshop Panel');

      _self.interval = 0;
       //Isolate the first LOD
      _viewer.hide([3,4]);
      _viewer.setGhosting(false)
      //To do: put the fps on the screen
      //var but = new Button();
      //_viewer.initModelStats();


      //This piece of code generates the array of URNs given one of them. 
      //ToDo: put this in its own funciton
      var stateFilter = {
                guid: false,
                seedURN: true,
                objectSet: false,
                viewport: false,
                renderOptions: false
            };
      templateURN = viewer.getState(stateFilter).seedURN;

      //ToDo: generate the array of URNs. 
      console.log('Viewing.Extension.Workshop loaded');
    
      var orig = atob(templateURN);
      console.log(orig);
      var partsArray = orig.split('_')
      partsArray.pop();
      partsArray = partsArray.join("");
      //partsArray.pop();
      console.log(partsArray);
      var tmp1 = '';
      var tmp = '';
      for (var i=0; i < LODs.length; ++i) {
        tmp = partsArray + "_" + LODs[i] + ".obj";
        console.log(tmp);
        //console.log(btoa(tmp));
        tmp = btoa(tmp).split('=');
        console.log(tmp);
        _URNs.push(tmp[0]);

      }
      //_URNs.sort();
      // console.log(_URNs);
      //  for (var i=0; i < LODs.length; ++i) {
      //   console.log(_URNs[i]);
      //   console.log(btoa(_URNs[i]));
      //   _URNs[i] = btoa(_URNs[i]);
      // }

      //console.log(_URNs);
    
      return true;

    };

    /////////////////////////////////////////////////////////////////
    // selection changed callback
    //
    /////////////////////////////////////////////////////////////////
    _self.onSelectionChanged = function (event) {

      // event is triggered also when component is unselected
      
      function propertiesHandler(result) {

          if (result.properties) {
            _self.panel.setProperties(
              result.properties);
            _self.panel.setVisible(true);
          }
        }

        _ctr++;
        _fpsAr.push(_viewer.impl.fps());
        if(_ctr % _space == 0 ) {
          //Todo - get the full array of dbIds, hardcoded for 3 LODs for now. 

          //var dbId = (_curID++ % _URNs.length) + 2; //change back to 3
     
          //console.log("here is _ctr: " + _ctr)
          //console.log("switching to: " + dbId);
          _viewer.getProperties(
            0,
            propertiesHandler);

          //_viewer.fitToView(dbId);
          //Bug: only when the DBID that was clicked on matches the _curID do we get desired behavior
          //_viewer.isolateById(dbId);
          //clear the array for next time



          _sum = getMean(_fpsAr);
          console.log(_sum);
          _fpsAr = [];



        

          //Here, implement 1) unload current model and 2) load the next LOD 
          //viewer.impl.unloadCurrentModel();
            //viewer.impl.removeModel (viewer.model) ;


          console.log(_ctr);
          console.log("would load this index: " + (_ctr % (_URNs.length * _space))/_space);
          //viewer.start(_URNs[1]);


          //The program successfully unloads the previous model, but does not load the next one. 
       //   viewer.loadModel(_URNs[1]);


          /*  var tokenurl = 'http://' + window.location.host + '/api/token';
            var config = {
                environment : 'AutodeskProduction'
                //environment : 'AutodeskStaging'
            };

            // Instantiate viewer factory
            var viewerFactory = new Autodesk.ADN.Toolkit.Viewer.AdnViewerFactory(
                tokenurl,
                config);
            viewerFactory.getViewablePath (_URNs[1],
                function(pathInfoCollection) {
                    viewer.load(pathInfoCollection.path3d[0].path);
                });
*/  

  loadModel(_URNs [parseInt((_ctr % (_URNs.length * _space))/_space)]);
            // Autodesk.Viewing.Document.load (
            //     'urn:' + _URNs [parseInt((_ctr % (_URNs.length * _space))/_space)],
            //     function (document) {
            //         var items3d =Autodesk.Viewing.Document.getSubItemsWithProperties (
            //             document.getRootItem (),
            //             {
            //                 'type': 'geometry',
            //                 'role': '3d'
            //             },
            //             true
            //         ) ;
            //         clearInterval (_self.interval) ;
            //         viewer.impl.unloadCurrentModel () ;
            //         viewer.loadModel (document.getViewablePath (items3d [0]), {}, function () {
            //             viewer.restoreState (state, stateFilter, true) ;
            //             viewer.setProgressiveRendering (false) ;
            //             viewer.setEnvMapBackground (false) ;
            //             viewer.setGroundShadow (false) ;
            //             viewer.setQualityLevel (viewer.prefs.ambientShadows, false) ;
            //             viewer.setGhosting (false) ;
            //             //setTimeout(1000, function () { _self.startRotation () ; }) ;
            //             _self.startRotation () ;
            //         }) ;
            //     }
            // ) ;

// catch(err) {
//   console.log(err);
//   loadModel(_URNs [parseInt((_ctr % (_URNs.length * _space))/_space)] + "==");





// }






          //ViewingApplication.prototype.getCurrentViewer();
          //viewer.load('dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE2LTA2LTI5LTIzLTI4LTM5LTJxdjBzNXVnbXVibWNleTAwMGdyMmhndDNibmYvYXJtYWRpbGxvXzI1OTQ1XzMwLm9iag==');
          //Autodesk.Viewing.Document.load(URN);
          //automate camera movement
         

        }
        else {

          //clearInterval(_self.interval);

          //_viewer.isolateById([]);
          //_viewer.fitToView();
          //_self.panel.setVisible(false);
        } 
    }
function getMean(A) {
    var sum = 0;
    for( var i = 0; i < A.length; i++ ){
      //console.log(A[i])
      sum +=  A[i]; 
    }
    sum = sum/A.length;
    return sum;
   }


   function loadModel(urn) {
                    console.log("trying this urn: " + urn);
                    var stateFilter = {
                guid: true,
                seedURN: false,
                objectSet: false,
                viewport: true,
                renderOptions: true
            };
            var state =viewer.getState (stateFilter) ;
                  Autodesk.Viewing.Document.load (
                'urn:' + urn,
                function (document) {
                    var items3d =Autodesk.Viewing.Document.getSubItemsWithProperties (
                        document.getRootItem (),
                        {
                            'type': 'geometry',
                            'role': '3d'
                        },
                        true
                    ) ;
                    clearInterval (_self.interval) ;
                    viewer.impl.unloadCurrentModel () ;
                    viewer.loadModel (document.getViewablePath (items3d [0]), {}, function () {
                        viewer.restoreState (state, stateFilter, true) ;
                        viewer.setProgressiveRendering (false) ;
                        viewer.setEnvMapBackground (false) ;
                        viewer.setGroundShadow (false) ;
                        viewer.setQualityLevel (viewer.prefs.ambientShadows, false) ;
                        viewer.setGhosting (false) ;
                        //setTimeout(1000, function () { _self.startRotation () ; }) ;
                        _self.startRotation () ;
                    }) ;
                }
            ) ;
   }


    /////////////////////////////////////////////////////////////////
    // rotates camera around axis with center origin
    //
    /////////////////////////////////////////////////////////////////
    _self.rotateCamera = function(angle, axis) {
      var pos = _viewer.navigation.getPosition();

      var position = new THREE.Vector3(
        pos.x, pos.y, pos.z);
      var rAxis = new THREE.Vector3(
        axis.x, axis.y, axis.z);

      var matrix = new THREE.Matrix4().makeRotationAxis(
        rAxis,
        angle);

      position.applyMatrix4(matrix);

      _viewer.navigation.setPosition(position);


    };

    /////////////////////////////////////////////////////////////////
    // start rotation effect
    //
    /////////////////////////////////////////////////////////////////

    _self.startRotation = function() {
      clearInterval(_self.interval);

      // sets small delay before starting rotation

      setTimeout(function() {
        _self.interval = setInterval(function () {
          _self.rotateCamera(0.05, {x:0, y:1, z:0});
        }, 100)}, 500);

    };

    /////////////////////////////////////////////////////////////////
    // unload callback: invoked when viewer.unloadExtension is called
    //
    /////////////////////////////////////////////////////////////////

    _self.unload = function () {

      _self.panel.setVisible(false);


      _self.panel.uninitialize();

      console.log('Viewing.Extension.Workshop unloaded');

      return true;

    };

  };

  /////////////////////////////////////////////////////////////////
  // sets up inheritance for extension and register
  //
  /////////////////////////////////////////////////////////////////

  Viewing.Extension.Workshop.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

  Viewing.Extension.Workshop.prototype.constructor =
    Viewing.Extension.Workshop;

  Autodesk.Viewing.theExtensionManager.registerExtension(
    'Viewing.Extension.Workshop',
    Viewing.Extension.Workshop);