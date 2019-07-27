import React, { Component } from "react";
import albumData from "./../data/albums";
import PlayerBar from "./PlayerBar";

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find(album => {
      return album.slug === this.props.match.params.slug;
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      volume: 0.8
      /* isHovered: null */
    };
    this.audioElement = document.createElement("audio");
    this.audioElement.src = album.songs[0].audioSrc;
  }

  formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - minutes * 60);

    if (seconds > 9) {
      return minutes + ":" + seconds;
    } else {
      return minutes + ":0" + seconds;
    }
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener(
      "timeupdate",
      this.eventListeners.timeupdate
    );
    this.audioElement.addEventListener(
      "durationchange",
      this.eventListeners.durationchange
    );
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener(
      "timeupdate",
      this.eventListeners.timeupdate
    );
    this.audioElement.removeEventListener(
      "durationchange",
      this.eventListeners.durationchange
    );
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(
      song => this.state.currentSong === song
    );
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(
      song => this.state.currentSong === song
    );
    const newIndex = Math.min(
      this.state.album.songs.length - 1,
      currentIndex + 1
    );
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume });
  }

  handleSongHover(song) {
    this.setState({ isHovered: song });
  }

  handleIcon(song, index) {
    if (this.state.currentSong === song && this.state.isPlaying) {
      return <span className="ion-pause" />;
    } else if (this.state.isHovered === song && !this.state.isPlaying) {
      return <span className="ion-play" />;
    } else {
      return index + 1 + ". ";
    }
  }

  render() {
    return (
      <div>
        <div id="bkGround">
          <div id="blackLayer">
            <img
              // id="blurred-background"
              src={this.state.album.albumCover}
              alt={this.state.album.title}
            />
          </div>
        </div>
        <div id="main">
          <div className="album">
            <div id="album-info">
              <img
                id="album-cover-art"
                className="w3-round-xxlarge"
                src={this.state.album.albumCover}
                alt={this.state.album.title}
              />
              <div className="album-details">
                <h1 id="album-title">{this.state.album.title}</h1>
                <h2 className="artist">{this.state.album.artist}</h2>
                <div id="release-info">
                  {this.state.album.releaseInfo} {this.state.album.label}
                </div>
              </div>
            </div>
            <table class="center" id="song-list">
              <colgroup>
                <col id="song-number-column" />
                <col id="song-title-column" />
                <col id="song-duration-column" />
              </colgroup>
              <tbody>
                {this.state.album.songs.map((song, index) => (
                  <tr
                    className="song"
                    key={index}
                    title={this.state.album.songs.title}
                    duration={this.state.album.songs.duration}
                    onClick={() => this.handleSongClick(song)}
                  >
                    <td
                      className="song-index"
                      onMouseEnter={() => this.handleSongHover(song)}
                      onMouseLeave={() => this.handleSongHover(null)}
                    >
                      {this.handleIcon(song, index)}
                    </td>
                    <td id="song-title">{song.title}</td>
                    <td id="song-duration">{this.formatTime(song.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PlayerBar
              isPlaying={this.state.isPlaying}
              currentSong={this.state.currentSong}
              currentTime={this.audioElement.currentTime}
              duration={this.audioElement.duration}
              currentVolume={this.audioElement.currentVolume}
              handleSongClick={() =>
                this.handleSongClick(this.state.currentSong)
              }
              handlePrevClick={() => this.handlePrevClick()}
              handleNextClick={() => this.handleNextClick()}
              handleTimeChange={e => this.handleTimeChange(e)}
              handleVolumeChange={e => this.handleVolumeChange(e)}
              formatTime={e => this.formatTime(e)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Album;
