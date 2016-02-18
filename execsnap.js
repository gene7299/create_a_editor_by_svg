
var createEditorBySnapSVG = function(id){

  var handle = {};
  handle.canvaswidth = 0;
  handle.canvasheight = 0;
  handle.width = 0;
  handle.height = 0;
  var transMatrix = [1,0,0,1,0,0];
  var mapMatrix;
  var paper;
  var maingroup;
  var ratio_w = 1;
  var ratio_h = 1;
  var nowZoomScale = 1;
  var dragStatus = "";
  var mySel;
  var shapes = [];
  handle.shapes = shapes;
  var shapeId = 1;
  function getRondom(max) {
    var min = 0;//,max = 150;
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  //---------------------------------------------------------------------------------
  function Shape(id, x, y, w, h,portrait, model){
        this.id = id || (Math.floor(Math.random() * 1000000000));
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 1;
        this.h = h || 1;
        this.portrait = portrait || 0;
        this.model = model || 'undefind';
        //this.zIndex = parseInt(zindex);
  };
  Shape.prototype.draw = function(){

    var myMatrix = new Snap.Matrix();
    myMatrix.translate(this.x,this.y);
    var group = maingroup.g().attr({transform:myMatrix});
    group.node.id = 'shape'+this.id;
    group.shapeObj =  this;
    group.mousedown(
      function(){
        this.attr({
          cursor:'move'
        })
        dragStatus = "moving";
      }
    )
    group.mouseup(
      function(){
        dragStatus = "";
        this.shapeObj.x = this.matrix.e;
        this.shapeObj.y = this.matrix.f;
      }
    )
    group.drag(

    function (dx, dy, x, y, e) {
        e.preventDefault();
    //console.log('dx='+dx+';dy='+dy+';x='+x+';y='+y+';e='+e)
        // Do your custom work here
        var moves = new Snap.Matrix();
        moves.translate(parseFloat(dx*ratio_w/nowZoomScale),parseFloat(dy*ratio_h/nowZoomScale));
        moves.add(this.origTransform.localMatrix);

        this.attr({
            //x: parseFloat(this.dragOrigX) + parseFloat(dx*ratio_w/nowZoomScale),
            //y: parseFloat(this.dragOrigY) + parseFloat(dy*ratio_h/nowZoomScale),
            //transform: origTransform + (origTransform ? "T" : "t") + [dx*ratio_w/nowZoomScale, dy*ratio_h/nowZoomScale]
            transform:moves
        });
        //console.log( moves.e+","+moves.f)

    },
    function (x, y, e) { // drag start position
        console.log('x='+x+';y='+y+';e='+e)
        //this.dragOrigX = this.attr("x");
        //this.dragOrigY = this.attr("y");
        this.origTransform = this.transform();
        //console.log(this.origTransform.localMatrix.e+","+this.origTransform.localMatrix.f)
    });

    var block = group.rect(0,0, 177, 100, 0, 0);
    block.attr({
        fill: "rgb(236, 240, 241)",
        stroke: "#1f2c39",
        strokeWidth: 3,
    });
    block.node.id = "block";
    group.text(88.5,64,this.id).attr({
                    fontWeight: 'bold',
                    fill: '#333333',
                    "font-size": "40px",
                    "text-anchor":"middle",
                    "font-family": "Arial Black"});
  }
  //---------------------------------------------------------------------------------
  build = function(){

    $('#'+id).css('width',handle.width+'px');
    $('#'+id).css('height',handle.height+'px');
    $('#'+id).html('<svg id="'+id+'_svg" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
    $('#'+id+'_svg').attr('preserveAspectRatio',"xMinYMin meet")
    paper = Snap('#'+id+'_svg');

    paper.attr({
      width:'100%',
      height:'100%',
      viewBox:'0 0 '+handle.canvaswidth+' '+handle.canvasheight+' ',
    })
    //$('#'+id+'_svg').css('background-image','url(grid_bg.png)')
    ratio_w = handle.canvaswidth/handle.width;
    ratio_h = handle.canvasheight/handle.height;


    maingroup = paper.g('map-matrix');
    maingroup.attr({
      transform:"matrix(1 0 0 1 0 0)",
    });
    maingroup.node.id = id+"_maingroup";
    //var bgPattern = maingroup.image("grid.png", 0, 0,27,27).pattern(0,0,27,27);
    var bgPattern = maingroup.path("M0 13.5 L27 13.5 M13.5 0 L13.5 27").attr('stroke','#F0F0F0').pattern(0,0,27,27);
    var background = maingroup.rect(0, 0,  handle.canvaswidth, handle.canvasheight, 0, 0).attr('fill',bgPattern);

    //var fobject = maingroup.group().el("foreignObject").attr("width", 480).attr("height", 500);
    //fobject.node.id = 'ff';
    //var fobjectHtml = "<h1>An HTML Foreign Object in SVG</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu enim quam. Quisque nisi risus, sagittis quis tempor nec, aliquam eget neque. Nulla bibendum semper lorem non ullamcorper. Nulla non ligula lorem. Praesent porttitor, tellus nec suscipit aliquam, enim elit posuere lorem, at laoreet enim ligula sed tortor. Ut sodales, urna a aliquam semper, nibh diam gravida sapien, sit amet fermentum purus lacus eget massa. Donec ac arcu vel magna consequat pretium et vel ligula. Donec sit amet erat elit. Vivamus eu metus eget est hendrerit rutrum. Curabitur vitae orci et leo interdum egestas ut sit amet dui. In varius enim ut sem posuere in tristique metus ultrices.<p>Integer mollis massa at orci porta vestibulum. Pellentesque dignissim turpis ut tortor ultricies condimentum et quis nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod lorem vulputate dui pharetra luctus. Sed vulputate, nunc quis porttitor scelerisque, dui est varius ipsum, eu blandit mauris nibh pellentesque tortor. Vivamus ultricies ante eget ipsum pulvinar ac tempor turpis mollis. Morbi tortor orci, euismod vel sagittis ac, lobortis nec est. Quisque euismod venenatis felis at dapibus. Vestibulum dignissim nulla ut nisi tristique porttitor. Proin et nunc id arcu cursus dapibus non quis libero. Nunc ligula mi, bibendum non mattis nec, luctus id neque. Suspendisse ut eros lacus. Praesent eget lacus eget risus congue vestibulum. Morbi tincidunt pulvinar lacus sed faucibus. Phasellus sed vestibulum sapien.";
    //$('#ff').html(fobjectHtml)


    return this;
  }

  build.add = function(){
    console.log('Add a element');
    var shape = new Shape(shapeId,10+getRondom(500) ,10+getRondom(500),177,100,0,"");
    shapes.push(shape);
    shape.draw();
    shapeId++;
  }

  build.panable = function(){

    var stateTf;
    var viewport = maingroup.node.nearestViewportElement;
    var self  = maingroup
         , state = ''
         , stateOrigin;
    viewport.addEventListener('mousemove', handleMouseMove, false);
    viewport.addEventListener('mousedown', handleMouseDown, false);
    viewport.addEventListener('mouseup', handleMouseUp, false);

     function handleMouseMove (e) {
       if (e.preventDefault)
         e.preventDefault();

       var CTM = self.transform().localMatrix.clone();
       var p = new Snap.Matrix(0, 0, 0, 0, e.clientX, e.clientY);

       if (state === 'pan') {
         p = stateTf.clone().add(p);
         self.transform(
           stateTf.invert()
                  .translate(p.e - stateOrigin.e, p.f - stateOrigin.f)
         );
       }
     }

     function handleMouseDown (e) {
       if (e.preventDefault)
         e.preventDefault();
       if (dragStatus == 'moving')
        return;
       state = 'pan';

       var CTM = self.transform().localMatrix.clone();
       var p   = new Snap.Matrix(0, 0, 0, 0, e.clientX, e.clientY);

       stateTf = CTM.invert();
       stateOrigin = stateTf.clone().add(p);
     }

     function handleMouseUp (e) {
       if (e.preventDefault)
         e.preventDefault();

       state = '';
     }
     return this;
  }
  build.zoomable = function(){
    var zoomScale = 0.2;
    var self  = maingroup;
    var scale = 1;
    registerMouseWheelHandler(maingroup.node.nearestViewportElement,zoomwheelhandler)
    function zoomwheelhandler (e) {
        if (e.preventDefault)
          e.preventDefault();

        var delta = e.wheelDelta ? e.wheelDelta / 360 : e.detail / -9;
        var z     = Math.pow(1 + zoomScale, delta);

        scale = scale*z;
        if(scale<1){
          scale = nowZoomScale;
          return;
        }

        var CTM = self.transform().localMatrix.clone();
        var p   = new Snap.Matrix(0, 0, 0, 0, e.clientX, e.clientY);
        p = CTM.invert().add(p);

        var k = new Snap.Matrix().translate(p.e, p.f)
                                 .scale(z)
                                 .translate(-p.e, -p.f);

        self.transform(CTM.add(k));

        if (typeof(stateTf) === 'undefined')
          stateTf = CTM.invert();

        stateTf.add(k.invert());

        nowZoomScale = scale;
      //  console.log('nowZoomScale='+nowZoomScale)
    }
    function registerMouseWheelHandler (node, cb) {
      if (navigator.userAgent.toLowerCase().indexOf('webkit') >= 0) {
        node.addEventListener('mousewheel', cb, false);
      } else {
        node.addEventListener('DOMMouseScroll', cb, false);
      }
    }

    return this;
  }

  for (i$ in handle) {
    (fn$.call(this, i$));
  }
  return build;
  function fn$(it){
    build[it] = function(v){
      if (arguments.length === 0) {
        return handle[it];
      } else {
        handle[it] = v;
        return build;
      }
    };
  }

}
var editor;
$( document ).ready(function(){
  editor = createEditorBySnapSVG('svgwrapper').canvaswidth(800).canvasheight(800).height(800).width(800);
  editor();
  editor.zoomable().panable();
})
