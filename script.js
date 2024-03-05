'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class Workout {

  date = new Date();
  id = (Date.now()+ ''). slice(-10);
  constructor(coords,duration, distance) {
    this.coords = coords;
    this.duration = duration; // in min
    this.distance = distance; // in km
  }
}

class running extends Workout{
  constructor(coords,duration, distance,cadence) {
 super(coords, duration, distance)
 this.cadence= cadence;
 this.calcPace();
  }

  calcPace() {
    this.pace = this.duration/ this.distance
    return this.pace;
  }
}

class cycling extends Workout{
  constructor (coords,duration,distance, elevationGain) {
    super(coords, duration, distance)
 this.elevationGain = elevationGain;
  this.calcSpeed()
  }

  calcSpeed() {
    this.speed = this.distance/ this.duration
    return this.speed;
  }
}

const run1 =  new running([39, -12], 5.2, 24 , 178)
const cycle1 = new cycling([39, -12], 23, 67, 523)
console.log(run1, cycle1);
//////////////////////////////////////////////////////////////////////
//// application architecture
class App{
  #map;
  #mapEvent;

  constructor() {
    this._getPosition()
    form.addEventListener('submit', this._newWorkout.bind(this))
   inputType.addEventListener('change', this._toggleElevationField)  
     }

  _getPosition() {
    if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
      alert('could not get your position');
    }
  );
  }

  _loadMap(position) {
    
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
      const coords = [latitude, longitude];
      console.log(this);
      this.#map = L.map('map').setView(coords, 13);
      //console.log(map);

      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);
      //handling clicks on map
      this.#map.on('click', this._showForm.bind(this))
       }
  _showForm(mapE) {
  this.#mapEvent = mapE;
  form.classList.remove('hidden');
  inputDistance.focus();
}

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        '';
    // display marker
    
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}
const app = new App();


