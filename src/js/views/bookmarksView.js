import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg';//parcel2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'NO bookmarks yet.Find a nice recipe and bookmark it;)'
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    // console.log(this._data);

    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');

  }

}
export default new BookmarksView();