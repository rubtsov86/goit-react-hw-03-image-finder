import React from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import axios from 'axios';
import '../styles.css';
import Loader from './Loader';
import Modal from './Modal';

class App extends React.Component {
  state = {
    images: [],
    inputValue: '',
    loading: false,
    showModal: '',
  };

  onSubmit = inputValue => {
    this.setState({ loading: true, inputValue, images: [] });
    this.fetchImages(inputValue);
  };

  onClickImage = e => {
    console.log(e.target.src);
    console.log(
      this.state.images.find(image => image.webformatURL === e.target.src)
        .largeImageURL
    );
    this.setState({
      showModal: this.state.images.find(
        image => image.webformatURL === e.target.src
      ).largeImageURL,
    });
  };

  onClickModal = e => {
    this.setState({ showModal: '' });
  };

  fetchImages = async value => {
    this.setState({ loading: true });
    let page = this.state.images.length / 12 + 1;
    axios.defaults.baseURL = `https://pixabay.com/api/?q=${value}&page=${page}&per_page=12&key=26229759-3aa7093be117df00e52b30f1f&image_type=photo&orientation=horizontal`;

    const response = await axios.get('/search?query=react');

    if (value !== this.state.inputValue) {
      page = 1;
    }

    console.log(response.data);

    if (this.state.images.length === response.data.totalHits) {
      return alert('end of collection');
    }
    this.setState({
      images: [...this.state.images, ...response.data.hits],
      loading: false,
    });
  };

  render() {
    return (
      <div className="App">
        <Searchbar onSubmit={this.onSubmit} />

        <ImageGallery images={this.state.images} onClick={this.onClickImage} />
        {this.state.loading && <Loader />}
        {this.state.images.length !== 0 && !this.state.loading && (
          <Button onClick={() => this.fetchImages(this.state.inputValue)} />
        )}
        {this.state.showModal && (
          <Modal image={this.state.showModal} onClick={this.onClickModal} />
        )}
      </div>
    );
  }
}

export { App };
