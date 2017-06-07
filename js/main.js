var gl
onload = _ => {
    var canvas = utils.getCanvas.fromId('#viewport')
    canvas.fitToScreen()
    gl = canvas.getGL2();
    //the shaders file in the .inFolder paramter should be named fragment.glsl and vertex.glsl
    Shaders.getProgram.inFolder('/shaders/colorMaterial').then(s => console.log(s))
}