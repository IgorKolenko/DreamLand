import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './homepage.css';
import img1 from './img1.jpg';
import img2 from './img2.jpg';
import Fade from 'react-reveal/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faHatWizard } from '@fortawesome/free-solid-svg-icons';

//Homepage component which loads on root level
class Homepage extends React.Component{
    render(){
        return(
            <div id="body">
                <div id="parallax-image">
                    <Fade top>
                        <h1>Enter a world of your liking</h1>
                        <p>With our amazing assortment of books</p>
                        <button type="submit" className="btn btn-primary" onClick={() => window.location.replace('/store')}>Store</button>
                    </Fade>
                </div>

                <div id="categories">
                    <Fade top>
                        <div className="category">
                            <FontAwesomeIcon className="icon" icon={faHatWizard} />
                            <h2>Fantasy</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec libero quis sem condimentum dictum. In eu nibh leo.</p>
                        </div>
                    </Fade>
                    <Fade top>
                        <div className="category">
                            <FontAwesomeIcon className="icon" icon={faHeart} />
                            <h2>Romance</h2>
                            <p>Aliquam luctus diam odio, id venenatis tellus tempus id. Nunc eu quam et nulla ornare malesuada. Integer sodales metus id volutpat tincidunt. Donec in dapibus ante.</p>
                        </div>
                    </Fade>
                    <Fade top>
                        <div className="category">
                            <FontAwesomeIcon className="icon" icon={faGraduationCap} />
                            <h2>Educational</h2>
                            <p>Integer gravida felis et nulla volutpat, at pharetra orci lacinia. Suspendisse elementum purus at nibh vehicula, non laoreet velit consectetur.</p>
                        </div>
                    </Fade>
                </div>

                <div id="journey">
                    <Fade left>
                        <div className="article">
                            <h2>Go on a journey</h2>
                            <p>Duis lacinia sapien non dapibus tempus. Vivamus tincidunt neque odio, vel bibendum nunc scelerisque tincidunt. Etiam dapibus nisi nulla, nec vehicula dolor euismod at. Quisque id erat turpis. Vivamus sapien magna, gravida vitae consequat et, dictum in orci. Phasellus a tortor et dolor condimentum fringilla eget in lectus.</p>
                        </div>
                    </Fade>
                    <img src={img1} height="305" width="500" ></img>
                </div>

                <div id="broaden">
                    <img src={img2} height="305" width="500" ></img>
                    <Fade right>
                        <div className="article">
                            <h2>Broaden your mind</h2>
                            <p>Pellentesque egestas lorem ut ex iaculis ultrices. Curabitur sagittis ipsum id dapibus scelerisque. Donec congue eget ligula vitae pellentesque. Sed a ante et ligula egestas consectetur vitae ac libero. Donec in vulputate felis, eu egestas enim. Praesent odio nisi, dignissim id commodo placerat, consectetur ultrices lacus. Cras lobortis tellus sit amet scelerisque mattis. Sed orci ligula, mollis viverra lobortis eget, varius non quam. Pellentesque varius feugiat malesuada.</p>
                        </div>
                    </Fade>
                </div>
            </div>
        );
    }
}

export default Homepage;