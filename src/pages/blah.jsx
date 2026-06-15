
import { useState } from "react";
import ReactGA from "react-ga4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faFacebook } from "@fortawesome/free-brands-svg-icons";

const Homepage = () => {
  
  return (
    <div className="page-container">
<div className="left-section">
  <section>
    <table>
      <tr> <th>VERDURAS</th>
      <th>Hay</th>
      <th>Pide</th>
      </tr>
    <tr>
      <td>Romaine lechuga</td>
       <td></td>
        <td></td>
    </tr>
       <tr>
      <td>Papas Francesas</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Cebolla</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Bell pepper (rojo y verde)</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Canela</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Spring mix</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Epazote</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Jitomate </td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Jitomate cherry</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Basil</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Ajo entero</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Thyme</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Rosmery</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Laurel</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Parsley</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Naranja</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Limon Amarillo</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Spinach</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Sparragus</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Brocolini</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Fresa</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Albaca Fresca</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Pineapple</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Oregano</td>
       <td></td>
        <td></td>
    </tr>
     <tr>
      <td>Papas</td>
       <td></td>
        <td></td>
    </tr>
    <tr>
      <td>Sweet potato</td>
       <td></td>
        <td></td>
    </tr>
    </table>
    </section>

<section>
    <table>
      <tr>
        <th>CARNES Y MARISCOS</th>
        <th>Hay</th>
        <th>Pide</th>
      </tr>
      <tr>
        <td>Camaron 8/12</td>
        <td></td>
        <td></td>
      </tr>
        <tr>
        <td>Langosta</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Calamari</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Salmon</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Branzino</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Pulpo</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Rib eye</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Ternera Steak</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Hueso babilla</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Lamb chops</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Wings</td>
        <td></td>
        <td></td>
      </tr>
    </table>

  </section>
  </div>
<div className="right-section">
<section>
    <table>
      <tr>
        <th>ABARROTES</th>
        <th>Hay</th>
        <th>Pide</th>
      </tr>
      <tr>
        <td>Pimienta negra molida</td>
        <td></td>
        <td></td>
      </tr>
        <tr>
        <td>Palillos p/ Bruchetta</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Arina</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Arroz</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Anchoas</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Aceite de oliva extra virgen</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Mostasa Dijon</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Mayonesa Nat</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Salsa inglesa Worcestershire</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Crutons</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Chile chipotle</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Chile powder</td>
        <td></td>
        <td></td>
      </tr>
        <tr>
        <td>Paprika</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Pan ajo o bayette</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Aceite</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Pure de papa instatanea</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Galleta maria</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Persley seco</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Miel</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Vainilla</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Linguini</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Texas Pete para wings</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Ajo en polvo</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Persley seco</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Cayenne pepper</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Cebolla en polvo</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Vainilla</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Concentrado de pollo</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Ginger en polvo</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Comino en polvo</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Kosher salt</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Azucar</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Garlic salt</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Tony chachere's creole seasoning</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Flour tortilla</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Corn tortilla</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Maizena</td>
        <td></td>
        <td></td>
      </tr>
    </table>

  </section>

 <section>
    <table>
      <tr>
        <th>LACTEOS</th>
        <th>Hay</th>
        <th>Pide</th>
      </tr>
      <tr>
        <td>Queso parmesano</td>
        <td></td>
        <td></td>
      </tr>
        <tr>
        <td>Disco de empanada</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Mantequilla</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Cream cheese</td>
        <td></td>
        <td></td>
      </tr>
       <tr>
        <td>Huevos</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Leche condensada</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Leche entera</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Sour Cream</td>
        <td></td>
        <td></td>
      </tr>
    </table>

  </section>
  </div>
    </div>
  );
};

export default Homepage;
