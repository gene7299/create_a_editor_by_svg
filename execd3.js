
var createEditorByD3 = function(id){

  var handle = {};
  handle.canvaswidth = 0;
  handle.canvasheight = 0;
  handle.width = 0;
  handle.height = 0;
  var transMatrix = [1,0,0,1,0,0];
  var mapMatrix;
  var paper;
  var maingroup;
  var zoomgroup;
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

    var group = maingroup.append('g').attr({
      transform:"translate("+this.x+","+this.y+")",
      id:'shape'+this.id
    });
    group.shapeObj = this;
    var block = group.append('rect').attr({
      x:0,
      y:0,
      width:177,
      height:100,
      rx:0,
      ry:0,
      fill: "rgb(236, 240, 241)",
      stroke: "#1f2c39",
    }).style({
       'stroke-width': 3,
    })
    var identifyId = group.append('text').attr({
      x:88.5,
      y:64,
      fontWeight: 'bold',
      fill: '#333333',
      "text-anchor":"middle"
    }).style({
      "font-size": "40px",
      "font-family": "Arial Black"
    }).text(this.id)

    var drag = d3.behavior.drag()
                .origin(function() {

                    var t = d3.select(this);
                    return {x: t.attr("x") + d3.transform(t.attr("transform")).translate[0],
                            y: t.attr("y") + d3.transform(t.attr("transform")).translate[1]};
                })
                .on("drag", function(d,i) {
                    d3.select(this).attr("transform", function(d,i){
                        return "translate(" + [ d3.event.x,d3.event.y ] + ")"
                    })
                })
                .on("dragstart", function() {
                    dragStatus = "moving";
                    d3.event.sourceEvent.stopPropagation(); // silence other listeners
                    d3.select(this).style({
                      cursor:'move'
                    })
                })
                .on("dragend", function() {
                  var tf = d3.transform(d3.select(this).attr("transform"));
                  group.shapeObj.x = tf.translate[0];
                  group.shapeObj.y = tf.translate[1];
                  dragStatus = "";
                  d3.select(this).style({
                    cursor:'auto'
                  })
                });
    group.call(drag);
    return;
  }
  //---------------------------------------------------------------------------------
  build = function(){

    $('#'+id).css('width',handle.width+'px');
    $('#'+id).css('height',handle.height+'px');

    var paper = d3.select('#'+id).append("svg")
    .attr("height", '100%')
    .attr("width", '100%')
    .attr("viewBox",'0 0 '+handle.canvaswidth+' '+handle.canvasheight+' ')
    .attr("id",id+'_svg')
    .attr("preserveAspectRatio","xMinYMin meet");

    ratio_w = handle.canvaswidth/handle.width;
    ratio_h = handle.canvasheight/handle.height;

    var defs = paper.append("defs")
    var bgPattern = defs.append("pattern")
    .attr({ id:"gridbg", width:"27", height:"27", patternUnits:"userSpaceOnUse", viewBox:"0 0 27 27"})
	  .append("path")
		.attr('d','M0 13.5 L27 13.5 M13.5 0 L13.5 27')
    .attr({ stroke:"#F0F0F0"})

    zoomgroup = paper.append('g').attr("transform","translate(0,0)")

    var rect = zoomgroup.append("rect")
        .attr("width", handle.canvaswidth)
        .attr("height", handle.canvasheight)
        .style("fill", "none")
        .style("pointer-events", "all");

    maingroup = zoomgroup.append('g')
    .attr("transform","translate(0,0)scale(1)")
    .attr("id",id+"_maingroup")


    var background = maingroup.append('rect')
    .attr({x:0, y:0, width:handle.canvaswidth, height:handle.canvasheight,fill:'url(#gridbg)'});

    /*
    var fobject = maingroup.append("foreignObject")
    .attr("width", 480)
    .attr("height", 500)
    .append("xhtml:body")
    .style("font", "14px 'Helvetica Neue'")
    .html("<h1>An HTML Foreign Object in SVG</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu enim quam. Quisque nisi risus, sagittis quis tempor nec, aliquam eget neque. Nulla bibendum semper lorem non ullamcorper. Nulla non ligula lorem. Praesent porttitor, tellus nec suscipit aliquam, enim elit posuere lorem, at laoreet enim ligula sed tortor. Ut sodales, urna a aliquam semper, nibh diam gravida sapien, sit amet fermentum purus lacus eget massa. Donec ac arcu vel magna consequat pretium et vel ligula. Donec sit amet erat elit. Vivamus eu metus eget est hendrerit rutrum. Curabitur vitae orci et leo interdum egestas ut sit amet dui. In varius enim ut sem posuere in tristique metus ultrices.<p>Integer mollis massa at orci porta vestibulum. Pellentesque dignissim turpis ut tortor ultricies condimentum et quis nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod lorem vulputate dui pharetra luctus. Sed vulputate, nunc quis porttitor scelerisque, dui est varius ipsum, eu blandit mauris nibh pellentesque tortor. Vivamus ultricies ante eget ipsum pulvinar ac tempor turpis mollis. Morbi tortor orci, euismod vel sagittis ac, lobortis nec est. Quisque euismod venenatis felis at dapibus. Vestibulum dignissim nulla ut nisi tristique porttitor. Proin et nunc id arcu cursus dapibus non quis libero. Nunc ligula mi, bibendum non mattis nec, luctus id neque. Suspendisse ut eros lacus. Praesent eget lacus eget risus congue vestibulum. Morbi tincidunt pulvinar lacus sed faucibus. Phasellus sed vestibulum sapien.");
    */

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
    // if you want only pan, don't want zoom
    var drag = d3.behavior.drag()
            .origin(function() {
                var t = d3.select(this);

                return {x: t.attr("x") + d3.transform(t.attr("transform")).translate[0],
                        y: t.attr("y") + d3.transform(t.attr("transform")).translate[1]};
            })
            .on("dragstart", function() {
                d3.event.sourceEvent.stopPropagation(); // silence other listeners
            })
            .on("drag", function(d,i) {
                d3.select(this).attr("transform", function(d,i){
                    return "translate(" + [ d3.event.x,d3.event.y ] + ")scale(" + nowZoomScale + ")"
                })
            });
     maingroup.call(drag);
     return this;
  }

  build.zoomable = function(){
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);
    function zoomed() {
      maingroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      nowZoomScale = d3.event.scale;

    }
    zoomgroup.call(zoom)
  //if you want the only zoom, don't want pan
  //  .on("mousedown.zoom", null)
  //  .on("touchstart.zoom", null)
  //  .on("touchmove.zoom", null)
  //  .on("touchend.zoom", null);
    return this;
  }
  build.zoom = function(scale)
  {

  }
  build.pan = function(dx, dy)
  {

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
  editor = createEditorByD3('svgwrapper').canvaswidth(800).canvasheight(800).height(800).width(800);
  editor();
  editor.zoomable();
})
