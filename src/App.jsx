import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

const CLIENT_ID = "1533cdc776c04c0bbb56942585357071";
const CLIENT_SECRET = "03a6cb8b71f44cbd8c334d8d1e1e2cd5";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  {
    /**Allows for the client that make the API calls to run once at the beginning of your program*/
  }
  useEffect(
    //API Access Token
    () => {
      var authParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
          "grant_type=client_credentials&client_id=" +
          CLIENT_ID +
          "&client_secret=" +
          CLIENT_SECRET,
      };
      fetch("https://accounts.spotify.com/api/token", authParameters)
        .then((result) => result.json())
        .then((data) => setAccessToken(data.access_token));
    },
    []
  );

  // Search
  async function search() {
    console.log(" Search for " + searchInput); //Taylor Swift

    // GET request using search to get the Artist ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("Artist ID is " + artistID);
    // GET request with Artist ID grab all of the albums from that artist
    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });
    // Dislay those albums to the user
  }
  console.log(albums);
  return (
    <div className="App">
      {/** Container keeps everything in a "container" in the center of the
      page*/}
      <Container>
        <InputGroup className="mb-3" size="lg">
          {/** Input Group is the search bar. But needs form control*/}
          <FormControl
            placeholder="Search for Artist"
            type="input"
            onKeyPress={(event) => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((albums, i) => {
            console.log(albums);
            return (
              <Card>
                <Card.Img src={albums.images[0].url} />
                <Card.Body>
                  <Card.Title>{albums.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
