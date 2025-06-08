"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// Remove the WebGPU import that's causing the error
// import { WebGPURenderer } from 'three/webgpu'

interface Node {
  id: string
  name: string
  type: "validator" | "user" | "result"
  connections: string[]
}

interface NetworkGraphProps {
  nodes: Node[]
  className?: string
}

export function NetworkGraph({ nodes = [], className }: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current || !nodes || !Array.isArray(nodes)) {
      setIsLoading(false)
      return
    }

    if (!containerRef.current) return

    // Set up scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 150

    // Set up renderer - use standard WebGLRenderer instead of WebGPU
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Create node objects
    const nodeObjects: { [key: string]: THREE.Mesh } = {}
    const nodePositions: { [key: string]: THREE.Vector3 } = {}

    nodes.forEach((node) => {
      let geometry
      let material

      switch (node.type) {
        case "validator":
          geometry = new THREE.IcosahedronGeometry(5, 0)
          material = new THREE.MeshStandardMaterial({ color: 0x4f46e5 })
          break
        case "user":
          geometry = new THREE.SphereGeometry(3, 32, 32)
          material = new THREE.MeshStandardMaterial({ color: 0x10b981 })
          break
        case "result":
          geometry = new THREE.BoxGeometry(4, 4, 4)
          material = new THREE.MeshStandardMaterial({ color: 0xf59e0b })
          break
        default:
          geometry = new THREE.SphereGeometry(3, 32, 32)
          material = new THREE.MeshStandardMaterial({ color: 0x6b7280 })
      }

      const mesh = new THREE.Mesh(geometry, material)

      // Position nodes in a sphere
      const phi = Math.acos(-1 + 2 * Math.random())
      const theta = Math.sqrt(Math.random()) * 2 * Math.PI

      const x = Math.sin(phi) * Math.cos(theta) * 70
      const y = Math.sin(phi) * Math.sin(theta) * 70
      const z = Math.cos(phi) * 70

      mesh.position.set(x, y, z)
      nodePositions[node.id] = new THREE.Vector3(x, y, z)

      scene.add(mesh)
      nodeObjects[node.id] = mesh
    })

    // Create connections
    if (nodes && Array.isArray(nodes)) {
      nodes.forEach((node) => {
        if (node && node.connections && Array.isArray(node.connections) && node.connections.length > 0) {
          node.connections.forEach((targetId) => {
            if (nodePositions && node.id && targetId && nodePositions[node.id] && nodePositions[targetId]) {
              const start = nodePositions[node.id]
              const end = nodePositions[targetId]

              const points = [start, end]
              const geometry = new THREE.BufferGeometry().setFromPoints(points)
              const material = new THREE.LineBasicMaterial({
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.5,
              })

              const line = new THREE.Line(geometry, material)
              scene.add(line)
            }
          })
        }
      })
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    animate()
    setIsLoading(false)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      Object.values(nodeObjects).forEach((mesh) => {
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose())
        } else {
          mesh.material.dispose()
        }
      })
    }
  }, [nodes])

  return (
    <div className={`relative min-h-[400px] ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full min-h-[400px]" />
    </div>
  )
}
