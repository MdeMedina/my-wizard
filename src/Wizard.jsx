import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Container, Row, Col, Form, Button, ButtonGroup } from 'react-bootstrap';
import { Text } from '@react-three/drei';
import "./App.css"
import Select, { components } from 'react-select';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsInfoCircle } from 'react-icons/bs'; // Bootstrap icon
import { useMediaQuery } from 'react-responsive';
import { FontLoader } from 'three/examples/jsm/Addons.js';

// Define tu hook para detectar si es mobile
const useIsMobile = () => useMediaQuery({ query: '(max-width: 390px)' });
const useIsTablet = () => useMediaQuery({ query: '(max-width: 768px)' });
const useIsSmallMonitor = () => useMediaQuery({ query: '(max-width: 1200px)' });

const COLOR_OPTIONS = {
  "Crimson Red": "#990000",
  "Scarlet": "#FF2400",
  "Burnt Orange": "#CC5500",
  "Gold": "#FFD700",
  "Vegas Gold": "#C5B358",
  "Navy Blue": "#00205B",
  "Royal Blue": "#4169E1",
  "Columbia Blue": "#C4D8E2",
  "Forest Green": "#014421",
  "Kelly Green": "#4CBB17",
  "Black": "#000000",
  "White": "#FFFFFF",
  "Maroon": "#800000",
  "Off White": "#F8F8F0"
};

const INVERTED_COLOR_OPTIONS = {
  "#990000": "Crimson Red",
  "#FF2400": "Scarlet",
  "#CC5500": "Burnt Orange",
  "#FFD700": "Gold",
  "#C5B358": "Vegas Gold",
  "#00205B": "Navy Blue",
  "#4169E1": "Royal Blue",
  "#C4D8E2": "Columbia Blue",
  "#014421": "Forest Green",
  "#4CBB17": "Kelly Green",
  "#000000": "Black",
  "#FFFFFF": "White",
  "#800000": "Maroon",
  "#F8F8F0": "Off White"
};


const textColorsBody = { '#B3B3B3': "Heather gray", '#1E4D2B': "Forest Green", '#1C2C4C': "Navy Blue", '#C8102E': "True Red", '#0033A0': "Royal Blue", "#000000": "Black" };
const textsleevesColors = {
  "Black": "#000000",
  "Off White": "#F8F8F0",
  "White": "#FFFFFF",
  "Varsity Gold": "#F2C300",
  "True Red": "#C8102E",
};

const addToCart = async (letra, nombre, number, bnumber, bNombre, talla = 2, bodyColor = '#0033A0', sleeveColor = '#ffffff', colorBordadoParche = "#000000", colorRellenoParche = "#ffffff", font = "fancy") => {
  console.log("Adding to cart with the following parameters:", { letra, nombre, number, bnumber, bNombre, talla, bodyColor, sleeveColor, colorBordadoParche, colorRellenoParche, font });
  const items = [
    [{ id: '42787754442887', quantity: 1 }, // XS - Build your Custom Jacket
    { id: '42787754475655', quantity: 1 }, // S
    { id: '42787754508423', quantity: 1 }, // M
    { id: '42787754541191', quantity: 1 }, // L
    { id: '42787754573959', quantity: 1 }, // XL
    { id: '42787754606727', quantity: 1 }, // 2XL
    ], // M - Build your Custom Jacket
    { id: '42821608538247', quantity: 1 }, // Embroidered name
    { id: '42821614502023', quantity: 1 }, // Chenille letter Patch
    { id: '42821614764167', quantity: 1 }, // Back Number
    { id: '42821618368647', quantity: 1 }, // Sleeve Number
    { id: '42821620465799', quantity: 1 }  // Back name
  ];
  let sendItems = [{ ...items[0][talla], properties: { "Body Color": textColorsBody[bodyColor], "Sleeve Color": textsleevesColors[sleeveColor] } }]; // Build your Custom Jacket

  if (nombre) {
    sendItems.push({ ...items[1], properties: { "Embroidered name": nombre } });
    sendItems[0].properties["Embroidered name"] = nombre; // Añadir letra al primer item
    sendItems[0].properties["Embroidered font"] = font; // Añadir letra al primer item
  }
  if (letra) {
    sendItems.push({ ...items[2], properties: { "Chenille letter Patch": letra } });
    sendItems[0].properties["Chenille letter Patch"] = letra; // Añadir letra al primer item
    sendItems[0].properties["Fill Color"] = INVERTED_COLOR_OPTIONS[colorRellenoParche]; // Añadir letra al primer item
    sendItems[0].properties["Outline Color"] = INVERTED_COLOR_OPTIONS[colorBordadoParche]; // Añadir letra al primer item
  }

  if (bnumber) {
    sendItems.push({ ...items[3], properties: { "Back Number": bnumber } });
    sendItems[0].properties["Back Number"] = bnumber; // Añadir letra al primer item
  }

  if (number) {
    sendItems.push({ ...items[4], properties: { "Sleeve Number": number } });
    sendItems[0].properties["Sleeve Number"] = number; // Añadir letra al primer item
  }
  if (bNombre) {
    sendItems.push({ ...items[5], properties: { "Back name": bNombre } });
    sendItems[0].properties["Back name"] = bNombre; // Añadir letra al primer item
  }


  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ items: sendItems })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Producto agregado al carrito:', data);
      window.location.reload(); // Redirigir al carrito después de agregar el producto
    } else {
      console.error('Error al agregar al carrito:', data);
    }

    console.log('Carrito actualizado:', data); // Recargar la página para reflejar los cambios en el carrito
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
  }
};


function AddToCartButton({ letra, nombre, number, bnumber, bNombre, talla, bodyColor, sleeveColor, colorBordadoParche, colorRellenoParche, font }) {
  return (
    <Button variant="primary" onClick={() => { addToCart(letra, nombre, number, bnumber, bNombre, talla, bodyColor, sleeveColor, colorBordadoParche, colorRellenoParche, font) }}>
      Add to Cart
    </Button>
  );
}



function InfoTooltip({ lines = [] }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip style={{ fontSize: "12px" }}>
          {lines.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx !== lines.length - 1 && <br />}
            </span>
          ))}
        </Tooltip>
      }
    >
      <span style={{ marginLeft: 6, cursor: 'pointer', color: '#666' }}>
        <BsInfoCircle size={14} />
      </span>
    </OverlayTrigger>
  );
}

function TextoSobreMesh({ texto, targetMesh }) {
  const ref = useRef();

  // Para posicionar el texto justo encima del mesh
  useEffect(() => {
    if (targetMesh && ref.current) {
      const box = new THREE.Box3().setFromObject(targetMesh);
      const center = box.getCenter(new THREE.Vector3());

      // Ajustás la posición para que esté un poco separado
      ref.current.position.copy(center);
      ref.current.position.z += 0.01; // Empuja un poquito hacia afuera
    }
  }, [targetMesh]);

  return (
    <Text
      ref={ref}
      fontSize={0.035}
      color="#000000"
      outlineColor="#ffffff"
      outlineWidth={0.001}
      anchorX="center"
      anchorY="middle"
      rotation={[0, 0, 0]}
      font="https://cdn.shopify.com/s/files/1/0652/3709/0439/files/fuenteModelo.ttf?v=1775082385"
    >
      {texto}
    </Text>
  );
}

function NombreBordado({ texto, font_url, font }) {
  // Ajustar tamaño según longitud del texto
  let baseSize = 0.034;
  const maxCharsBeforeShrink = 8;
  const shrinkFactor = 0.002;
  let color = "#ffffff"; // Color del texto
  let oColor = "#ffffff"; // Color del borde
  // Aseguramos que font_url siempre tenga una fuente por defecto por si acaso
  font_url = "https://cdn.shopify.com/s/files/1/0652/3709/0439/files/fuenteModelo.ttf?v=1775082385";

  // Convertimos a minúscula para evitar errores de tipeo
  if (font && font.toLowerCase() === "fancy") {
    font_url = "https://cdn.shopify.com/s/files/1/0652/3709/0439/files/cursiva.ttf?v=1775082385";
  } else if (font === "") {
    baseSize = 0.04;
    // Si la fuente vacía en tu lógica significa block letter, mantenemos la de arriba
  }
  console.log("Font URL:", font_url);
  console.log("Font:", font);
  const adjustedFontSize = Math.max(
    baseSize - Math.max(0, texto.length - maxCharsBeforeShrink) * shrinkFactor,
    0.018 // Límite mínimo para que no quede ilegible
  );
  return (

    <Text
      position={[-0.16, 0.35, 0.195]} // Ubicación del texto
      fontSize={adjustedFontSize}
      color={color} // Color del text
      outlineColor={oColor}
      outlineWidth={0.001}
      // Ancho del borde
      anchorX="center"
      anchorY="middle"
      rotation={[-0.3, -0.13, 0]} // Para que mire al frente si es necesario
      font={font_url} // Fuente personalizada
    >
      {texto}
    </Text>
  );
}
const anchoPorLetra = {
  A: 0.6, B: 0.6, C: 0.55, D: 0.6, E: 0.55, F: 0.55, G: 0.6, H: 0.6, I: 0.3, J: 0.4, K: 0.6,
  L: 0.5, M: 0.75, N: 0.65, O: 0.6, P: 0.6, Q: 0.6, R: 0.6, S: 0.55, T: 0.5, U: 0.6,
  V: 0.6, W: 0.8, X: 0.6, Y: 0.6, Z: 0.6,
  ' ': 0.3
};

function NombreAtras({ texto = "", colorBordadoParche, colorRellenoParche }) {
  const radio = 0.6;
  const baseZ = -0.519;
  const baseY = 0.47;
  let baseSize = 0.15;
  const maxCharsBeforeShrink = 6;
  const shrinkFactor = 0.017;
  const scale = Math.PI / 22; // Escala para convertir "ancho" a ángulo
  const adjustedFontSize = Math.max(
    baseSize - Math.max(0, texto.length - maxCharsBeforeShrink) * shrinkFactor,
    0.068 // Límite mínimo para que no quede ilegible
  );

  const letras = texto.toUpperCase().split("");
  const totalAngularWidth = letras.reduce((acc, char) => {
    const rawWidth = anchoPorLetra[char] || 0.5;
    const scaledWidth = rawWidth * (adjustedFontSize / 0.07);
    return acc + scaledWidth * scale;
  }, 0);

  let currentAngle = -totalAngularWidth / 2;
  return (
    <>
      <group rotation={[0.2, 0, 0]}>
        <group rotation={[0.45, Math.PI, 0]} position={[0.05, -0.05, baseZ]}>
          {letras.map((char, i) => {
            const rawWidth = anchoPorLetra[char] || 0.5;
            const scaledWidth = rawWidth * (adjustedFontSize / 0.07);
            const angle = currentAngle + scaledWidth * scale / 2;

            const x = radio * Math.sin(angle);
            const yOffset = radio * Math.cos(angle);
            const y = baseY + (yOffset - radio);
            currentAngle += scaledWidth * scale;

            return (
              <Text
                key={i}
                position={[x, y, 0]}
                rotation={[0.31, 0, -angle]}
                fontSize={adjustedFontSize}
                color={colorRellenoParche}
                outlineColor={colorBordadoParche}
                outlineWidth={0.004}
                anchorX="center"
                anchorY="middle"
                font="https://cdn.shopify.com/s/files/1/0652/3709/0439/files/fuenteModelo.ttf?v=1775082385"
              >
                {char}
              </Text>
            );
          })}
        </group>
      </group>
    </>
  );
}



function NumerosAtras({ texto, colorBordadoParche, colorRellenoParche }) {
  if (texto.length === 1) {
    texto = "0" + texto;
  }
  return (
    <Text
      position={[0.028, 0.1, -0.295]} // Ubicación del texto
      fontSize={0.45}
      color={colorRellenoParche} // Color del text
      outlineColor={colorBordadoParche}
      outlineWidth={0.004}
      // Ancho del borde
      anchorX="center"
      anchorY="middle"
      rotation={[0.08, 3.15, 0]} // Para que mire al frente si es necesario
      font="https://cdn.shopify.com/s/files/1/0652/3709/0439/files/fuenteModelo.ttf?v=1775082385" // Fuente personalizada
    >
      {texto}
    </Text>
  );
}

function NumeroSleeve({ texto = "", colorBordadoParche, colorRellenoParche }) {
  if (texto.length === 1) {
    texto = "0" + texto;
  }

  const radio = 0.4;
  const separacion = Math.PI / 11;       // controla separación física
  const intensidadGiro = Math.PI / 5;     // controla cuán "girados" se ven los números
  const baseZ = -0.04;
  const baseY = 0.34;

  const letras = texto.toUpperCase().split('');

  return (
    <group rotation={[0, 1.38, 0]} position={[0.5413, baseY, baseZ]}>
      {letras.map((char, i) => {
        const offset = i - (letras.length - 1) / 2;

        const posAngle = separacion * offset;
        const rotAngle = intensidadGiro * offset;

        const x = radio * Math.sin(posAngle);
        const z = radio * (1 - Math.cos(posAngle));

        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[-0.4, rotAngle, 0]} // rotación independiente, más pronunciada
            fontSize={0.2}
            color={colorRellenoParche}
            outlineColor={colorBordadoParche}
            outlineWidth={0.002}
            anchorX="center"
            anchorY="middle"
            font="https://cdn.shopify.com/s/files/1/0652/3709/0439/files/fuenteModelo.ttf?v=1775082385"
          >
            {char}
          </Text>
        );
      })}
    </group>
  );
}


function LetraBordada({ texto, colorBordadoParche, colorRellenoParche }) {
  return (
    <Text
      position={[0.225, 0.345, 0.2018]} // Ubicación del texto
      fontSize={0.28}
      color={colorRellenoParche} // Color del text
      outlineColor={colorBordadoParche}
      outlineWidth={0.005}
      // Ancho del borde
      anchorX="center"
      anchorY="middle"
      rotation={[-0.35, 0.14, 0]} // Para que mire al frente si es necesario
      font="https://cdn.shopify.com/s/files/1/0652/3709/0439/files/fuenteModelo.ttf?v=1775082385"
    >
      {texto}
    </Text>
  );
}

function Modelo({ bodyColor, sleeveColor, setTargetMesh }) {
  const { scene, nodes, materials } = useGLTF("https://cdn.shopify.com/3d/models/4db8f598a28efa7d/Modelo.glb");
  console.log(materials);
  setTargetMesh(nodes.Parche_manga_D); // Asigna el mesh al estado para que pueda ser referenciado por TextoSobreMesh
  useEffect(() => {
    scene.traverse((child) => {
      if (
        child.isMesh &&
        (
          /^[0-9]$/.test(child.name) ||         // "0", "1", ..., "9"
          /^[0-9]_/.test(child.name) ||         // "0_contorno", "1_shadow", etc.
          /contorno/i.test(child.name) ||       // cualquier cosa que contenga "contorno" (incluso mal escrito)
          /cotnorno/i.test(child.name)          // typo común incluido
        )
      ) {
        child.visible = false; // oculta el mesh
        // o: scene.remove(child); para eliminarlo del árbol completamente
      }
    });

    if (materials.Cuerpo_base) {
      materials.Cuerpo_base.color.set(bodyColor);

    }
    if (materials.Mangas) {
      materials.Mangas.color.set(sleeveColor);
      materials.Botones.color.set(sleeveColor);
      materials.Botones.color.set(sleeveColor);
      materials[""].color.set(sleeveColor);
      materials.Pretina_y_puños.color.set(sleeveColor);
      materials.Bolsillos.color.set(sleeveColor);
    }
  }, [bodyColor, sleeveColor, materials]);

  return (
    <group scale={1.5} position={[-0.05, -1.4, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function CameraLight() {
  const { camera } = useThree();
  return (
    <group>
      <directionalLight position={[1, 0, -1]} intensity={1.3} />
      <directionalLight position={[-1, 0, 1]} intensity={1.3} />
      <ambientLight intensity={0.5} />
    </group>
  );
}

function WindowScene({ bodyColor, sleeveColor, nombre = "", letra = "", bNombre = "", bnumber = "", colorRellenoParche, colorBordadoParche, number = "", font }) {
  const [targetMesh, setTargetMesh] = useState("");
  // Aquí puedes usar los props bodyColor, sleeveColor, nombre y letra
  // para personalizar el modelo y los textos.
  console.log("WindowScene props:", { bodyColor, sleeveColor, nombre, letra, bNombre });

  // Si necesitas hacer algo con estos valores, puedes hacerlo aquí.
  // Por ejemplo, podrías pasarlos a un estado o usarlos directamente en el renderizado.
  return (

    <Container className="col-6 mx-3 d-flex justify-content-center align-items-center"
      style={{
        width: '90%',
        height: '500px',
        position: 'relative',
        border: '2px solid black',
        background: '#eee',
      }}>
      <img
        src="https://cdn.shopify.com/s/files/1/0652/3709/0439/files/180.png?v=1775082387" // cámbiala por tu URL real
        alt="Logo"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '70px',
          height: 'auto',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 20 }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }} s
      >
        <CameraLight />
        <Suspense fallback={"algo salio mal"}>
          <Modelo bodyColor={bodyColor} sleeveColor={sleeveColor} setTargetMesh={setTargetMesh} />
          <NombreBordado texto={nombre} font={font} />
          <NumeroSleeve texto={number} colorBordadoParche={colorBordadoParche} colorRellenoParche={colorRellenoParche} />
          {/* <TextoSobreMesh texto={letra} targetMesh={targetMesh} /> */}
          <NombreAtras texto={bNombre} colorBordadoParche={colorBordadoParche} colorRellenoParche={colorRellenoParche} />
          <NumerosAtras texto={bnumber + ""} colorBordadoParche={colorBordadoParche} colorRellenoParche={colorRellenoParche} />
          <LetraBordada texto={letra} colorBordadoParche={colorBordadoParche} colorRellenoParche={colorRellenoParche} />
          {/* <NumeroSleeve texto={letra} /> */}
        </Suspense>
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </Container>
  );
}

function SizeSelector({ setTalla }) {
  const [selectedSize, setSelectedSize] = useState("M");
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
      {sizes.map((size, index) => (
        <button
          key={index}
          className={`btn-size ${selectedSize === size ? 'selected' : ''}`}
          onClick={() => { setSelectedSize(size); setTalla(index) }}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
function ColorSelector({ setBodyColor, setSleeveColor }) {
  const bodyColors = ['#B3B3B3', '#1E4D2B', '#1C2C4C', '#C8102E', '#0033A0', "#000000"];
  const textColorsBody = { '#B3B3B3': "Heather gray", '#1E4D2B': "Forest Green", '#1C2C4C': "Navy Blue", '#C8102E': "True Red", '#0033A0': "Royal Blue", "#000000": "Black" };
  const sleeveColors = {
    "Black": "#000000",
    "Off White": "#F8F8F0",
    "White": "#FFFFFF",
    "Varsity Gold": "#F2C300",
    "True Red": "#C8102E",
  };

  const [selectedBodyColor, setSelectedBodyColor] = useState(bodyColors[2]);
  const [selectedSleeveColor, setSelectedSleeveColor] = useState(Object.values(sleeveColors)[1]);
  const [bodyColorText, setbodyColorText] = useState('#B3B3B3')
  const [sleeveColorText, setSleeveColorText] = useState('#00000')
  useEffect(() => {
    setBodyColor(selectedBodyColor)
    setbodyColorText(textColorsBody[selectedBodyColor])
  }, [selectedBodyColor])
  useEffect(() => {
    setSleeveColor(selectedSleeveColor)
    setSleeveColorText(Object.keys(sleeveColors).find(key => sleeveColors[key] === selectedSleeveColor))
  }, [selectedSleeveColor])

  return (
    <>
      {/* Body Colors */}
      <Form.Group className="mb-4 ">
        <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Body Color       <Form.Text className="text-muted" style={{ fontSize: "12px" }}>
          (24oz Merino Wool)
        </Form.Text></div>
        <Row>
          <Col xs={12} sm={5}>
            <div className="d-flex gap-2 mt-1">
              {bodyColors.map((color, index) => (
                <div
                  key={index}
                  className='bodyColors'
                  onClick={() => setSelectedBodyColor(color)}
                  style={{
                    backgroundColor: color,
                    width: 25,
                    height: 25,
                    borderRadius: '50%',
                    border: '1px solid #ccc',
                    boxShadow: selectedBodyColor === color ? 'inset 0 0 0 4px #F9F8F3' : 'inset 0 0 0 2px #F9F8F3',
                    padding: 0
                  }}
                />
              ))}
            </div></Col>
          <Col xs={12} sm={7}></Col>
        </Row>
        <Form.Text style={{ fontSize: "14px", color: selectedBodyColor }}>
          {bodyColorText}
        </Form.Text>
      </Form.Group>
      {/* Sleeve Colors */}
      <Form.Group className="mb-4">
        <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Leather Sleeves</div>
        <Row>
          <Col xs={12} sm={4}>
            <div className="d-flex gap-2 mt-1">
              {Object.entries(sleeveColors).map(([name, color], index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSleeveColor(color)}
                  className='bodyColors'
                  style={{
                    backgroundColor: color,
                    width: 25,
                    height: 25,
                    borderRadius: '0%',
                    border: '1px solid #ccc',
                    boxShadow: selectedSleeveColor === color ? 'inset 0 0 0 4px #F9F8F3' : 'inset 0 0 0 2px #F9F8F3',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </Col>
          <Col xs={8} ></Col>
        </Row>
        <Form.Text className="text-muted" style={{ fontSize: "14px", }}>
          {sleeveColorText}
        </Form.Text>
      </Form.Group>
    </>
  );
}



const options = Object.entries(COLOR_OPTIONS).map(([label, hex]) => ({
  label,
  value: hex,
  color: hex
}));

const customStyles = {
  control: (styles) => ({
    ...styles,
    fontSize: '13px',
    minHeight: '32px',
    width: '70px', // más ancho el cuadrado selector
    padding: 0
  }),
  menu: (styles) => ({
    ...styles,
    width: '150px' // ancho del menú desplegable
  }),
  option: (styles, { data, isFocused, isSelected }) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: isSelected ? data.color : isFocused ? '#f2f2f2' : 'white',
    color: isSelected ? '#fff' : '#000',
    fontSize: '13px',
    height: '30px',
    padding: '2px 8px'
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px'
  }),
};

function ColorPickerSelect({ label = "Color", value, onChange }) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="mb-3">
      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) => onChange(selected.value)}
        styles={customStyles}
        placeholder="" // ❌ Quita la palabra "Select..."
        getOptionLabel={(e) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: e.color,
                border: '1px solid #ccc',
                borderRadius: '4px',
                flexShrink: 0
              }}
            />
            <span>{e.label}</span>
          </div>
        )}
        getSingleValueLabel={(e) => (
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: e.color,
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        )}
        isSearchable={false}
        menuPlacement="auto"
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null
        }}
      />
    </div>
  );
}


const optionsFont = [
  { value: '', label: 'Block Letter', fontFamily: '' },
  { value: 'fancy', label: 'Fancy', fontFamily: 'Fancy' },
];

// Cómo se muestra cada opción en el dropdown
const CustomOption = (props) => (
  <components.Option {...props}>
    <div style={{ fontFamily: props.data.fontFamily, fontSize: '18px' }}>
      Aa ({props.data.label})
    </div>
  </components.Option>
);

// Cómo se muestra la fuente seleccionada
const CustomSingleValue = (props) => (
  <components.SingleValue {...props}>
    <div style={{ fontFamily: props.data.fontFamily, fontSize: '18px' }}>
      Aa
    </div>
  </components.SingleValue>
);

function FuenteSelector({ selectedOption, onChange }) {
  return (
    <div className="mb-3">
      <Select
        options={optionsFont}
        value={options.find((opt) => opt.value === selectedOption)}
        onChange={(selected) => onChange(selected.value)}
        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
        isSearchable={false}
        menuPlacement="auto"
      />
    </div>
  );
}

function ConfigPanel({ bodyColor, sleeveColor,
  nombre, letra,
  bNombre, colorRellenoParche,
  colorBordadoParche, number, font, setBodyColor, setSleeveColor, setNombre, setLetra, setBnombre, setBnumber, bnumber, setColorRellenoParche, setColorBordadoParche, setNumber, setFont }) {
  const [talla, setTalla] = useState(2)
  const controlConfig = {
    border: '0.1px solid rgb(118, 118, 118)',
    borderRadius: '0',
    padding: '10px',
    fontSize: '12px',
  };
  return (
    <Container className="d-flex flex-column p-4 justify-content-center">
      {/* Tallas */}
      {/* Envío */}
      {/* Body Colors */}
      <ColorSelector setBodyColor={setBodyColor} setSleeveColor={setSleeveColor} />

      {/* Chest Letter Patch */}
      <Form.Group className="mb-3">
        <Row>
          <Col xs={6} >
            <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Chest Chenille Letter Patch <InfoTooltip lines={["Max. 1 Character", "Add: $15.00"]} /> </div>
          </Col>
          <Col xs={3} >
            <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Fill Color </div>
          </Col>
          <Col xs={3} >
            <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Outline Color </div>
          </Col>
        </Row>
        <Row>
          <Col xs={6} >
            <Form.Control type="text" placeholder="" size="sm" style={{ ...controlConfig, width: "27%" }} maxLength={1} onChange={(e) => {
              console.log(e.target.value);
              setLetra(e.target.value.toUpperCase());
            }} />
          </Col>
          <Col xs={3} >
            <ColorPickerSelect label="Color" value={"#000"} onChange={setColorRellenoParche} />
          </Col>
          <Col xs={3} >
            <ColorPickerSelect label="Color" value={"#000"} onChange={setColorBordadoParche} />
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Row>
          <Col xs={6} >
            <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Embroidered Name <InfoTooltip lines={["Max. 14 Characters", "Add: $10.00"]} /></div>
          </Col>
          <Col xs={6} >
            <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Embroidery Font </div>
          </Col>
        </Row>
        <Row>
          <Col xs={6} >
            <Form.Control type="text" placeholder="Enter your name..." size="sm" style={controlConfig} maxLength={14} onChange={(e) => {
              console.log(e.target.value);
              setNombre(e.target.value);
            }} />
          </Col>
          <Col xs={6} >
            <FuenteSelector onChange={setFont} selectedOption={font} />
          </Col>
        </Row>
      </Form.Group>

      {/* Embroidery Name */}
      <Form.Group className="mb-3">
        <Row>
          <Col xs={6}>
            <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Sleeve Number <InfoTooltip lines={["Max. 2 Characters", "Add: $10.00"]} /></div>
            <Form.Control type="number" size="sm" style={controlConfig} maxLength={2} onChange={(e) => {
              const valor = e.target.value;
              if (valor.length <= 2) {
                setNumber(e.target.value);
              }
            }} value={number} />
          </Col>
          <Col xs={6} >
            <Form.Group>
              <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Back Number <InfoTooltip lines={["Add: $30.00"]} /></div>
              <Form.Control type="number" size="sm" style={controlConfig} maxLength={2} onChange={(e) => {
                const valor = e.target.value;
                if (valor.length <= 2) {
                  setBnumber(valor);
                }
              }} value={bnumber} />
            </Form.Group>
          </Col>
        </Row>
      </Form.Group>





      {/* Back Embroidery */}
      <Row className="mb-3">
        <Col xs={12} >
          <Form.Group>
            <div style={{ fontSize: "12px", fontWeight: '500', marginBottom: ".5rem" }}>Back Name <InfoTooltip lines={["Max. 14 Characters", "Add: $30.00"]} /></div>
            <Form.Control type="text" size="sm" style={controlConfig} maxLength={14} onChange={(e) => {
              console.log(e.target.value);
              setBnombre(e.target.value);
            }} />
          </Form.Group>
        </Col>

      </Row>
      <SizeSelector setTalla={setTalla}></SizeSelector>
      <AddToCartButton
        bodyColor={bodyColor}
        sleeveColor={sleeveColor}
        letra={letra}
        nombre={nombre}
        bNombre={bNombre}
        bnumber={bnumber}
        number={number}
        font={font}
        colorRellenoParche={colorRellenoParche}
        colorBordadoParche={colorBordadoParche}
        talla={talla}
      />
    </Container>
  );
}

function Wizard() {
  const [bodyColor, setBodyColor] = useState('#0033A0'); // azul marino inicial
  const [sleeveColor, setSleeveColor] = useState('#F8F8F0'); // blanco inicial
  const [letra, setLetra] = useState("");
  const [nombre, setNombre] = useState("");
  const [bnombre, setBnombre] = useState("");
  const [ColorBordadoParche, setColorBordadoParche] = useState("#000000");
  const [ColorRellenoParche, setColorRellenoParche] = useState("#ffffff");
  const [bnumber, setBnumber] = useState("");
  const [number, setNumber] = useState("");
  const [font, setFont] = useState("Fancy");
  return (
    <Container style={{
      backgroundColor: "#F9F8F3",
    }}>
      <h1 className='d-flex justify-content-center varsity-font my-0 text-center ' style={{ width: '90%', margin: '0 auto', fontSize: useIsMobile() ? "60px" : "80px" }}>START BUILDING</h1>
      <Row className="d-flex justify-content-center mb-4">
        <Col xs={12} lg={6} className="d-flex justify-content-center align-items-center">
          <WindowScene
            bodyColor={bodyColor}
            sleeveColor={sleeveColor}
            letra={letra}
            nombre={nombre}
            bNombre={bnombre}
            bnumber={bnumber}
            number={number}
            font={font}
            colorRellenoParche={ColorRellenoParche}
            colorBordadoParche={ColorBordadoParche} />
        </Col>
        {/* 🎨 Lado derecho: Panel de personalización */}
        <Col xs={12} lg={6} className="d-flex justify-content-center align-items-center">
          <ConfigPanel
            bodyColor={bodyColor}
            sleeveColor={sleeveColor}
            letra={letra}
            nombre={nombre}
            bNombre={bnombre}
            bnumber={bnumber}
            number={number}
            font={font}
            colorRellenoParche={ColorRellenoParche}
            colorBordadoParche={ColorBordadoParche}
            setBodyColor={setBodyColor}
            setSleeveColor={setSleeveColor}
            setLetra={setLetra}
            setNombre={setNombre}
            setBnombre={setBnombre}
            setBnumber={setBnumber}
            setNumber={setNumber}
            setFont={setFont}
            setColorBordadoParche={setColorBordadoParche}
            setColorRellenoParche={setColorRellenoParche} />
        </Col>
      </Row>
    </Container>
  );
}

export default Wizard;
