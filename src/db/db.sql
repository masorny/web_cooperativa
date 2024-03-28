CREATE DATABASE IF NOT EXISTS db_cooperativa;

USE db_cooperativa;

CREATE TABLE IF NOT EXISTS t_user(
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(128) NOT NULL,
    Pwd VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS t_partner(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(128) NOT NULL,
    LastName VARCHAR(128) NOT NULL,
    Phone VARCHAR(128),
    Dni VARCHAR(256),
    Address VARCHAR(512) NOT NULL,
    StatusId INT NOT NULL,
    JoinedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE IF NOT EXISTS t_partner_status(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(16) NOT NULL 
);

CREATE TABLE IF NOT EXISTS t_partner_aporte(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    PartnerId INT NOT NULL,
    Aporte INT NOT NULL,
    Saldo INT NOT NULL,
    Deuda INT NOT NULL,
    FechaCubierto DATETIME NOT NULL
);

ALTER TABLE t_partner
    ADD FOREIGN KEY (StatusId) REFERENCES t_partner_status(Id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION;

ALTER TABLE t_partner_aporte
    ADD FOREIGN KEY (PartnerId) REFERENCES t_partner(Id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION;

INSERT IGNORE INTO t_partner_status(Name) VALUES ("Activo"), ("Suspendido");

-- CUENTAS INICIALES
INSERT IGNORE INTO t_user(Name, Pwd) VALUES ("adrian", "adrian123");

-- SOCIOS
INSERT IGNORE INTO t_partner(Name, LastName, Phone, Dni, Address, StatusId)
    VALUES
    ("Bruno Aarom", "Fretes Vera", '981-273-332', 4427742, "Avda. Mcal Lopez c/ Rpca. Argentina 1832", 1),
    ("Lorena Maria", "Urbieta Campuzano", 985-372-123, 2642662, "Avda. Artigas e/ Primer Presidente 2482", 1),
    ("José Miguel", "Tamayo Cañiza", 973-222-362, 24624246, "Estados Unidos, Azara 403", 1),
    ("Guillermo Adrian", "Martinez Ramirez", 971-362-122, 2462462464, "Avda. Artigas c/ Gral. Francisco Roa", 2),
    ('Juan', 'Pérez', '555-1234', 2464624662, 'Calle Principal 123', 1),
    ('María', 'García', '555-5678', 246246246246, 'Avenida Central 456', 2),
    ('Luis', 'Martínez', '555-2468', 24624624, 'Calle Grande 789', 1),
    ('Ana', 'López', '555-1357', 346363, 'Carrera 10 1010', 2),
    ('Pedro Pablo', 'Sánchez', '555-3698', 366346346, 'Avenida de los Árboles 77', 1),
    ('Carolina', 'Gómez Martínez', '555-9876', 346346363, 'Calle Peatonal 456', 2),
    ('Andrés', 'Díaz', '555-5555', 34633463464, 'Avenida Principal 987', 1),
    ('Sofía', 'Rodríguez', '555-4444', 346463, 'Calle Nueva 654', 2),
    ('Javier', 'Ramírez', '555-3333', 34634463463, 'Avenida Moderna 321', 1),
    ('Valentina', 'Vega Pérez', '555-2222', 346364346346, 'Calle Ancha 852', 2),
    ('Roberto', 'Hernández García', '555-1111', 34634636, 'Avenida Pequeña 147', 1),
    ('Laura', 'Suárez', '555-6789', 34634634646, 'Calle Larga 369', 1),
    ('Gabriel', 'Gutiérrez López', '555-9876', 346346436, 'Avenida Estrecha 753', 1),
    ('Mariana', 'Ortega', '555-6543', 346346366, 'Calle Estrecha 951', 1),
    ('Diego', 'Navarro Pérez', '555-4321', 3463634636, 'Avenida Larga 246', 1),
    ('Isabella', 'Lara', '555-7890', 3463636463, 'Calle Moderna 159', 2),
    ('Alejandro', 'Castro García', '555-8765', 583834834, 'Avenida Ancha 753', 2),
    ('Camila', 'Mendoza', '555-3210', 22336436, 'Calle Principal 852', 2),
    ('Martín', 'Peralta Pérez', '555-5678', 45747474, 'Avenida Central 369', 1),
    ('Paula', 'Rojas', '555-1357', 33753375, 'Carrera 10 753', 1);