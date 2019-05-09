<?php
    include('utils/auth.php');
    include('config.php');
    require_auth();

    echo json_encode(
        array("items" => array(
            array(
                "id" => 1,
                "title" => "First resources",
                "description" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut lorem sit amet ex posuere varius. Nam metus velit, sagittis placerat quam ac, sagittis tincidunt enim. Curabitur rutrum egestas lorem, non mollis libero lacinia eget. Integer felis arcu, pharetra sed bibendum et, dictum ut orci."
            ),
            array(
                "id" => 2,
                "title" => "Second resources",
                "description" => "Aliquam nisl orci, placerat non massa ac, sollicitudin semper justo. Vivamus lacinia eu dui eget mollis. Duis ornare feugiat orci, sit amet commodo urna."
            ),
            array(
                "id" => 3,
                "title" => "Third resources",
                "description" => "Nunc a elementum justo. Etiam sapien justo, feugiat nec est et, sagittis pulvinar velit. Pellentesque rhoncus, nunc et rhoncus commodo, justo odio vestibulum metus, eget pulvinar nibh metus vitae massa."
            )
        ))
    );
?>