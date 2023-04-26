import { Canvas } from '@react-three/fiber'
import { Edges, useGLTF, OrbitControls, ContactShadows } from '@react-three/drei'

import AltarUrl from '../public/top-altar.gltf'
//import AltarUrl from '../public/altar-without-top.gltf'

const MODELS = {
  Beech: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf',
  Lime: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf',
  Spruce: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf'
}

export default function Altar() {
  return (
    <>
      <Model position={[0, -1, 0]} url={AltarUrl} />
    </>
  )
}

function Model({ url, ...props }) {
  const { scene } = useGLTF(url)
  return (
    <group {...props}>
      <mesh geometry={scene.children[0].geometry}>
        <meshBasicMaterial transparent opacity={0} />
        <Edges>
          <lineBasicMaterial color={[25, 0, 0]} toneMapped={false} />
        </Edges>
      </mesh>
    </group>
  )
}

// Silently pre-load all models
Object.values(MODELS).forEach(useGLTF.preload)
