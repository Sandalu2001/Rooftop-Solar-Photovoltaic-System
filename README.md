# Rooftop-Solar-Photovoltaic-System
Final Year Project

#  SolarSync

SolarSync is an intelligent rooftop solar analysis platform that leverages satellite imagery and machine learning to help users identify the best areas for solar panel placement. The system detects shadows, estimates solar potential, and visualizes insights using real-world geospatial data.

<img width="355" alt="image" src="https://github.com/user-attachments/assets/944500be-8302-4dfb-901b-37e290d6203f" />
---

##  Features

-  **Satellite Map Integration** (Google Earth Engine)
-  **Rooftop Detection** using ML-based segmentation
-  **Shadow Detection** for different times of the day
-  **Solar Potential Estimation** (Daily/Monthly)
-  **Interactive Dashboard** for solar analysis
-  Built with **Python**, **Flask**, and **Machine Learning**

---

## Architecture

<img width="541" alt="image" src="https://github.com/user-attachments/assets/b8a79f9d-9407-44b0-a216-9f8b7343de37" />

## Methodology

<img width="292" alt="image" src="https://github.com/user-attachments/assets/4b451c1d-2148-49ef-9d80-069701c94a6e" />

<img width="575" alt="image" src="https://github.com/user-attachments/assets/b4998767-ffe3-4cda-9c44-0ecce3be7c82" />


## 🖼️ Screenshots

###  Main Dashboard

![Bezel](https://github.com/user-attachments/assets/9468dfca-e247-4173-88d1-a0e225548a82)


###  Rooftop Shadow Detection

<img width="482" alt="image" src="https://github.com/user-attachments/assets/c5ca2266-6085-47ce-9f62-13b979304452" />

### Polygon Extrusion 

![image](https://github.com/user-attachments/assets/b54fc60b-95d1-4bdb-abd8-45bb83414355)

###  Solar Potential Estimation

<img width="512" alt="image" src="https://github.com/user-attachments/assets/2738d272-de09-4939-938b-b6b6e0b76245" />

###  Analytics View

<img width="481" alt="image" src="https://github.com/user-attachments/assets/097e709b-a4f8-4136-82e0-cfdca7243aa2" />

---

## 🛠️ Tech Stack

| Layer       | Tools Used                                      |
|-------------|-------------------------------------------------|
| **Frontend**| React.js, Material UI                           |
| **Backend** | Django REST Framework, Python                   |
| **ML Model**| TensorFlow, OpenCV, scikit-learn, rasterio      |
| **Cloud**   | AWS EC2, S3, Google Earth Engine                |
| **Database**| PostgreSQL, PostGIS                             |

---

## 🧠 How It Works

1. **User Input**: Enter location/address or select region on satellite map.
2. **Rooftop Detection**: ML model segments the building rooftop.
3. **Shadow Analysis**: Calculates shadows throughout the day using sun path and building height estimates.
4. **Solar Estimation**: Estimates kWh potential using light exposure and weather data.
5. **Result Display**: Best locations for panels are shown with color heatmaps.

---

## 🔧 Installation & Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
./setup.bash
