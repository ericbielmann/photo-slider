import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import EXIF from 'exif-js';

function App() {
  // const images = [
  //   `${process.env.PUBLIC_URL}/images/tarea-modo-manual-eric-1.JPG`,
  //   `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-1.JPG`,
  //   `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-2.JPG`,
  //   `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-3.JPG`,
  //   `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-4.JPG`,
  // ];

  const images = useMemo(() => {
    return [
      `${process.env.PUBLIC_URL}/images/tarea-modo-manual-eric-1.JPG`,
      `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-1.JPG`,
      `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-2.JPG`,
      `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-3.JPG`,
      `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-4.JPG`,
    ];
  }, []);

  const [iso, setISO] = useState();
  const [exposureTime, setExposureTime] = useState();
  const [fNumber, setFNumber] = useState();
  
  const [allExif, setAllExif] = useState([]);

  const [selctedImage, setSelectedImage] = useState(images[0]);
  const sliderRef = useRef(null);
  const selectedImgRef = React.useRef(null);

  function deepCompareEquals(a, b){
    if(!a.length && !b.length) {
      return false;
    }
    return JSON.stringify(a) === JSON.stringify(b)
  }

  function useDeepCompareMemoize(value) {
    const ref = useRef() 
    // it can be done by using useMemo as well
    // but useRef is rather cleaner and easier
  
    if (!deepCompareEquals(value, ref.current)) {
      ref.current = value
    }
  
    return ref.current
  }
  
  function useDeepCompareEffect(callback, dependencies) {
    useEffect(
      callback,
      dependencies.map(useDeepCompareMemoize)
    )
  }
  
  const getExifData = useCallback(() => {
    // const test2 = `${process.env.PUBLIC_URL}/images/tarea-modo-manual-caro-1.JPG`;
    // const file = new File([test2], 'tarea-modo-manual-caro-1.JPG');
    // const img1 = document.getElementById('featured');
    //  EXIF.getData(img1, function() {

    const slider = document
      .getElementById('slider')
      .getElementsByTagName('img');
      let exifList = [];

    let index = 0;
    for (const sliderImg of slider) {
      console.log(sliderImg);
      // eslint-disable-next-line no-loop-func
      EXIF.getData(sliderImg, function () {
        const exifData = EXIF.pretty(this);

        if (exifData) {
          const allTags = EXIF.getAllTags(this);
          exifList.push({
            Index: index,
            ExposureTime: allTags.ExposureTime,
            FNumber: allTags.FNumber,
            ISOSpeedRatings: allTags.ISOSpeedRatings,
          });
        } else {
          console.log("No EXIF data found in image '");
        }
      });
      index++;
    }
    if(!deepCompareEquals(allExif, exifList)) {
      setAllExif(exifList);
    }
  });

  useEffect(() => {
    getExifData();
  }, [getExifData]);

  const slideLeft = () => {
    sliderRef.current.scrollLeft -= 180;
  };

  const slideRight = () => {
    sliderRef.current.scrollLeft += 180;
  };

  const onSelectImage = (img) => {
    const indexImage = images.findIndex((x) => x.includes(img));
    const selectedExif = allExif[indexImage]

    setISO(selectedExif?.ISOSpeedRatings);
    setExposureTime(selectedExif?.ExposureTime?.numerator + '/' + selectedExif?.ExposureTime?.denominator);
    setFNumber(selectedExif?.FNumber.toString())

    setSelectedImage(img);
  };

  return (
    <div className="App">
      <div id="content-wrapper">
        <div className="column">
          <img
            id="featured"
            ref={selectedImgRef}
            src={selctedImage}
            alt="bg img"
          />

          <div id="slide-wrapper">
            <img
              id="slideLeft"
              className="arrow"
              onClick={slideLeft}
              src={`${process.env.PUBLIC_URL}/images/arrow-left.png`}
              alt="arrow-left"
            />

            <div id="slider" ref={sliderRef}>
              {images.map((img, index) => (
                <img
                  key={index}
                  className={`thumbnail ${
                    selctedImage === img ? 'active' : ''
                  }`}
                  onClick={(e) => onSelectImage(img)}
                  src={img}
                  alt="img"
                />
              ))}
            </div>

            <img
              id="slideRight"
              className="arrow"
              onClick={slideRight}
              src={`${process.env.PUBLIC_URL}/images/arrow-right.png`}
              alt="arrow-right"
            />
          </div>
        </div>

        <div className="column">
          <h1>Modo Manual</h1>
          <hr />
          <p>
            <strong>ISO: </strong>
            {iso}
          </p>
          <p>
            <strong>Exposure Time: </strong>
            {exposureTime}
          </p>
          <p>
            <strong>F: </strong>
            {fNumber}
          </p>
          {/* <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <input defaultValue="1" type="number" min="1" />
          <button className="btn btn-dark">Add to Cart</button> */}
        </div>
      </div>
    </div>
  );
}

export default App;
