<?php
define("DB_HOST", "localhost");
define("DB_USERNAME", "root");
define("DB_PASSWORD", "");
define("DB_DATABASE_NAME", "id22107572_notice");

$method = $_SERVER['REQUEST_METHOD'];

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

try {
    $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);
    
    if ($conn->connect_error) {
        throw new Exception("Erro de conexão: " . $conn->connect_error);
    }
} catch (Exception $e) {
    echo json_encode(array("message" => $e->getMessage()));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'list') {
    $sql = "SELECT * FROM noticia";
    $result = $conn->query($sql);
    
    $news = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $news[] = $row;
        }
    }

    echo json_encode($news);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'search') {
    if(isset($_GET['titulo'])) {
        $titulo = $_GET['titulo'];
        $sql = "SELECT * FROM noticia WHERE titulo LIKE '%$titulo%'";
        $result = $conn->query($sql);

        $news = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $news[] = $row;
            }
        }

        echo json_encode($news);
        exit();
    } else {
        echo json_encode(array("message" => "O parâmetro 'titulo' é obrigatório."));
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'add') {
    $data = json_decode(file_get_contents('php://input'), true);

    $titulo = $data['titulo'];
    $autor = $data['autor'];
    $conteudo = $data['conteudo'];
    $imagem = $data['imagem'];

    $sql = "INSERT INTO noticia (titulo, autor, conteudo, imagem) VALUES ('$titulo', '$autor', '$conteudo', '$imagem')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "Notícia adicionada com sucesso."));
    } else {
        echo json_encode(array("message" => "Erro ao adicionar notícia: " . $conn->error));
    }
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'update') {
    if(isset($_GET['id'])) {
        $id = $_GET['id'];

        $data = json_decode(file_get_contents('php://input'), true);

        if(isset($data['titulo'], $data['autor'], $data['conteudo'], $data['imagem'])) {
            $titulo = $data['titulo'];
            $autor = $data['autor'];
            $conteudo = $data['conteudo'];
            $imagem = $data['imagem'];

            $sql = "UPDATE noticia SET titulo=?, autor=?, conteudo=?, imagem=? WHERE id=?";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("ssssi", $titulo, $autor, $conteudo, $imagem, $id);

                if ($stmt->execute()) {
                    echo json_encode(array("message" => "Notícia atualizada com sucesso."));
                } else {
                    echo json_encode(array("message" => "Erro ao atualizar notícia: " . $stmt->error));
                }

                $stmt->close();
            } else {
                echo json_encode(array("message" => "Erro ao preparar a declaração SQL: " . $conn->error));
            }
        } else {
            echo json_encode(array("message" => "Todos os campos são necessários."));
        }
    } else {
        echo json_encode(array("message" => "O parâmetro 'id' não foi fornecido."));
    }
    exit();
}




if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['action']) && $_GET['action'] === 'delete') {
    if(isset($_GET['id'])) {
        $id = $_GET['id'];

        $sql = "DELETE FROM noticia WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Notícia deletada com sucesso."));
        } else {
            echo json_encode(array("message" => "Erro ao deletar notícia: " . $conn->error));
        }
    } else {
        echo json_encode(array("message" => "O parâmetro 'id' não foi fornecido."));
    }
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getOne') {
    if(isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql = "SELECT * FROM noticia WHERE id=$id";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode($row);
        } else {
            echo json_encode(array("message" => "Notícia não encontrada."));
        }
        exit();
    } else {
        echo json_encode(array("message" => "O parâmetro 'id' é obrigatório."));
        exit();
    }
}


$conn->close();

?>