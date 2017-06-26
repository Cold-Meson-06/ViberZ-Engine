const buffer = (_=>{
  const sizeOfFloat = 4
  
  const UnitTypes = {
    mat4:{
      components:16,
      byteSize: 16 * sizeOfFloat
    },
    vec3:{
      components:3,
      byteSize: 3 * sizeOfFloat
    },
    vec2:{
      components:2,
      byteSize: 2 * sizeOfFloat
    },
    int:{
      components:31,
      byteSize: 1 * sizeOfFloat
    },
    float:{
      components:1,
      byteSize: 1 * sizeOfFloat
    },
    bool:{
      components:1,
      byteSize: 1 * sizeOfFloat
    }
  }
  
  const CreateSignature = (rawSignature = ['vec3']) => {
    
	  let memoryLayout = rawSignature
	  let bufferStride = 0
	  let lengthMultiplier = 0
	  let elements = []
   
    for( let i of rawSignature ){
      let type = UnitTypes[i]
      bufferStride += type.byteSize
      lengthMultiplier += type.components
      elements.push(type)
    }
    
    let Signature = {
      bufferStride,
      memoryLayout,
      elements,
      lengthMultiplier,
      
      getOffSet(index){
        let offset = 0
        for(let i = 0; i < index; i++){
          offset += this.elements[i].byteSize
        }
        return offset
      }
    }
  }
  return CreateSignature
})()
