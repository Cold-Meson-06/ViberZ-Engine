const Shaders = {
    getShaders: {
        inFolder(url, name) {
            return Shaders.getShaders.byURLs(url + '/vertex.glsl', url + '/fragment.glsl')
        },
        byURLs(url1, url2) {
            return Promise.all([Shaders.loadShader(url1), Shaders.loadShader(url2)])
        }
    },
    loadShader(url) {
        return utils.getText(url)
    },
    createShader: {
        byString(str) {
            var string = str
            var type = Shaders.utils.getShaderType(str)
            var _enum = Shaders.utils.shaderTypeToEnum(type)
            var shader = gl.createShader(_enum)
            gl.shaderSource(shader, string)
            gl.compileShader(shader)
            var compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
            if (!compileStatus) {
                var infoLog = gl.getShaderInfoLog(shader)
                console.error('Falied to compile vertex shader :', infoLog || 'No info log returned from the context, But semms to be an syntax error.')
            }
            return shader
        },
        byURL(url){
            return Shaders.loadShader(url).then(shader=>
                Shaders.createShader.byString(shader)
            )
        }
    },
    getProgram: {
        inFolder(url) {
            return Shaders.getShaders.inFolder(url).then(shaderArray => {
                var vertexShader = Shaders.createShader.byString(shaderArray[0])
                var fragmentShader = Shaders.createShader.byString(shaderArray[1])
                return Shaders.getProgram.byShaders(vertexShader, fragmentShader)
            })
        },
        byURLs(url1, url2){
            return Shaders.getShaders.byURLs(url1, url2).then(shaderArray => {
                var vertexShader = Shaders.createShader.byString(shaderArray[0])
                var fragmentShader = Shaders.createShader.byString(shaderArray[1])
                return Shaders.getProgram.byShaders(vertexShader, fragmentShader)
            })
        },
        byShadersStrings(vs, fs){
            var vertexShader = Shaders.createShader.byString(vs)
            var fragmentShader = Shaders.createShader.byString(fs)
            return Shaders.getProgram.byShaders(vertexShader, fragmentShader)
        },
        byShaders(vs, fs) {
            let program = gl.createProgram()
            gl.attachShader(program, vs)
            gl.attachShader(program, fs)
            gl.linkProgram(program)
            let linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)
            if (!linkStatus) {
                infoLog = gl.getProgramInfoLog(program)
                console.error('Falied to link the shader program (Maybe them have incorrect inputs/outputs/precision).', infoLog || 'No info log returned from the context')
            }
            let validateStatus = 'not validated'
            return program
        },
        empty(){
            return gl.createProgram()
        }
    },
    utils: {
        getShaderType: str => /gl_Position/.test(str) ? 'VERTEX_SHADER' : 'FRAGMENT_SHADER',
        shaderTypeToEnum: type => gl[type]
    },
    GetES3Data(input){
        let data = {uniforms:{}, inputs:{}, functions:{}, structs:{}, constants:{}}
        let buff = input.match(/in.*;|uniform.*int.*|void.*|float.*/)
        if(buff.lenght){
            buff.map(item => {
                let [systemArg, constType, varName] = item.split(' ')
                varName = varName.slice(0, varName.length - 1)
                shaderData[systemArg].push({name, type})
            })
        }
        shaderData.isVertex = /gl_Position/.test(input)
    },
    GetES2Data(){
    
    },
}


    const getE2ShaderData = (str) => {
        let shaderData = { uniform: {}, attribute: {} }
        let data = str.match(/attribute.*;|uniform.*;/g)
        data && data.map(item => {
            let [type1, type2, name] = item.split(' ')
            name = name.slice(0, name.length - 1)
            shaderData[type1][name] = {}
            shaderData[type1][name].location = name
            shaderData[type1][name].type = type2
        })
        shaderData.isFragmentShader = /gl_FragColor/.test(str)
        shaderData.isVertexShader = /gl_Position/.test(str)
        return shaderData
    }
    
