-- Read all about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/text_fields.html

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import String
import Bootstrap.CDN as CDN
import Bootstrap.Form.Input as Input
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Row as Row
import Bootstrap.Grid.Col as Col
import Bootstrap.Card as Card

main =
  beginnerProgram { model = "", view = view, update = update }


-- UPDATE

type Msg = NewContent String

update (NewContent content) oldContent =
  content


-- VIEW

view content =
    Grid.container []
    [ CDN.stylesheet
    , Grid.row []
        [ Grid.col [] [ h1[] [ text "EDI" ] ] ]
    , Grid.row []
        [ Grid.col [] [ h2[] [ text "Ethical Data Initiative" ] ] ]
    , Grid.row []
        [ Grid.col [] [Input.text
                           [ Input.attrs [ placeholder "Search for an App"
                                         , style [ ( "text-align", "center" ) ]
                                         ]
                           , Input.large
                           ] ] ]
    , Card.config []
        |> Card.block []
            [ Card.text [] [ text "This is some text within a card block." ] ]
        |> Card.view
    ]
