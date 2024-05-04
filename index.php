<?php

// Definindo as credenciais do banco de dados
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
// if ($method == "OPTIONS") {
// header('Access-Control-Allow-Origin: *');
// header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
// header("HTTP/1.1 200 OK");
// die();
// }


try {
    $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);
    
    if ($conn->connect_error) {
        throw new Exception("Erro de conexão: " . $conn->connect_error);
    }
} catch (Exception $e) {
    echo "Erro ao conectar ao banco de dados: " . $e->getMessage();
    exit();
}

// Rota para listar todas as notícias (GET)
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

// Rota para pesquisar notícias por título (GET)
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
        echo "O parâmetro 'titulo' não foi fornecido.";
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'add') {
    $data = json_decode(file_get_contents('php://input'), true);
    

    $titulo = $data['titulo'];
    $autor = $data['autor'];
    $conteudo = $data['conteudo'];
    $imagem = $data['imagem'];
    
    // Inserir a notícia no banco de dados
    $sql = "INSERT INTO noticia (titulo, autor, conteudo, imagem) VALUES ('$titulo', '$autor', '$conteudo', '$imagem')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "Notícia adicionada com sucesso."));
    } else {
        echo json_encode(array("message" => "Erro ao adicionar notícia: " . $conn->error));
    }
    exit();
}


// Rota para atualizar uma notícia (PUT)
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'update') {
    // Pega o ID diretamente de $_GET
    if(isset($_GET['id'])) {
        $id = $_GET['id'];

        // Lê o conteúdo do corpo da solicitação e decodifica o JSON
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Verifica se todos os campos necessários foram fornecidos
        if(isset($data['titulo'], $data['autor'], $data['conteudo'], $data['imagem'])) {
            $titulo = $data['titulo'];
            $autor = $data['autor'];
            $conteudo = $data['conteudo'];
            $imagem = $data['imagem'];

            // Atualizar a notícia no banco de dados
            $sql = "UPDATE noticia SET titulo='$titulo', autor='$autor', conteudo='$conteudo', imagem='$imagem' WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
               echo json_encode(array("message" => "Notícia atualizada com sucesso."));
            } else {
                echo json_encode(array("message" => "Erro ao atualizar notícia: " . $conn->error));
            }
        } else {
            echo json_encode(array("message" => "Todos os campos são necessários."));
        }
    } else {
        echo json_encode(array("message" => "O parâmetro 'id' não foi fornecido."));
    }
    exit();
}




// Rota para deletar uma notícia (DELETE)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['action']) && $_GET['action'] === 'delete') {
    // Pega o ID diretamente de $_GET
    if(isset($_GET['id'])) {
        $id = $_GET['id'];

        // Deletar a notícia no banco de dados
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


// Rota para pegar uma notícia por ID (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getOne') {
    if(isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql = "SELECT * FROM noticia WHERE id=$id";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode($row);
        } else {
            echo "Nenhuma notícia encontrada com o ID fornecido.";
        }
        exit();
    } else {
        echo "O parâmetro 'id' não foi fornecido.";
        exit();
    }
}


// Fechando a conexão
$conn->close();

?>