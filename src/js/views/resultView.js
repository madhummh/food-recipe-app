import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg';//parcel2

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your querry please try again;'
  _message = '';
  _generateMarkup() {

    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');

  }

}
export default new ResultView();