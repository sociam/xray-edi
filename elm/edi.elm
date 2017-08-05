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
        , Card.config []
        |> Card.block []
            [ Card.text [] [ h1 [ style [ ( "text-align", "center" )] ]
                                [ text "EDI" ]
                           ]
            , Card.text [] [ h3 [ style [ ( "text-align", "center" )] ]
                                [ text "Ethical Data Initiative" ]
                           ]
            , Card.text []  [ Input.text
                                [ Input.attrs
                                      [ placeholder "Search for an App"
                                      , style [ ( "text-align", "center" ) ]
                                      , onInput NewContent
                                      ]
                                , Input.large
                                ]
                            ]
            , Card.text [] [ text content ]
            ]
        |> Card.view
    ]
