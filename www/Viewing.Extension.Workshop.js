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
    var _curID = 0;
    var _ctr = 0;
    var _fpsAr = [];
    var _sum = 0;
    var _space = 200;
    var _maxFPS = 50;
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

      _viewer.initDebugTools();
      _viewer.addEventListener(
        Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      _self.onSelectionChanged); //change the event listener

      _self.panel = new Viewing.Extension.Workshop.WorkshopPanel (
        _viewer.container,
        'WorkshopPanelId',
        'Workshop Panel');

      _self.interval = 0;
      _viewer.setGhosting(false)


      //This piece of code generates the array of URNs given one of them. 

      var stateFilter = {
        guid: false,
        seedURN: true,
        objectSet: false,
        viewport: false,
        renderOptions: false
      };
      templateURN = viewer.getState(stateFilter).seedURN;


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
        tmp = partsArray + "_" + LODs[i] + ".zip";
        console.log(tmp);
        console.log(btoa(tmp));
        tmp = btoa(tmp).split('=');
        //console.log(tmp);
        _URNs.push(tmp[0]);
      }


      //load the smallest LOD
      loadModel(_URNs[_curID]);
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

        //reevaluate the LOD representation
        if(_ctr % _space == 0 ) {
          _viewer.getProperties(
            0,
            propertiesHandler);

          _sum = getMean(_fpsAr);
          console.log(_sum);
          _fpsAr = [];
          console.log(_ctr);
          console.log("would load this index: " + (_ctr % (_URNs.length * _space))/_space);

          
          if (_curID < _URNs.length-1 && _sum > _maxFPS ) {
            _curID++;

            loadModel(_URNs [_curID]);
          }

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
          viewer.setProgressiveRendering (true) ;
          viewer.setEnvMapBackground (false) ;
          viewer.setGroundShadow (false) ;
          viewer.setQualityLevel (viewer.prefs.ambientShadows, false) ;
          viewer.setGhosting (false) ;
                        //setTimeout(1000, function () { _self.startRotation () ; }) ;
                        //_self.startRotation () ;
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