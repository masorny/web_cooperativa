BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "usuario_ingreso" (
	"id_ingreso"	INTEGER,
	"id_usuario"	INTEGER NOT NULL,
	"fecha_ingreso"	datetime NOT NULL,
	PRIMARY KEY("id_ingreso" AUTOINCREMENT)
);
INSERT INTO "usuario_ingreso" VALUES (1,1,'2024-06-11 18:35:04');
INSERT INTO "usuario_ingreso" VALUES (2,1,'2024-06-11 18:37:52');
INSERT INTO "usuario_ingreso" VALUES (3,1,'2024-06-11 18:42:15');
INSERT INTO "usuario_ingreso" VALUES (4,1,'2024-06-11 18:42:18');
INSERT INTO "usuario_ingreso" VALUES (5,1,'2024-06-11 18:42:22');
INSERT INTO "usuario_ingreso" VALUES (6,1,'2024-06-11 18:42:26');
INSERT INTO "usuario_ingreso" VALUES (7,1,'2024-06-11 18:42:31');
INSERT INTO "usuario_ingreso" VALUES (8,2,'2024-06-11 18:47:30');
INSERT INTO "usuario_ingreso" VALUES (9,1,'2024-06-11 18:48:03');
INSERT INTO "usuario_ingreso" VALUES (10,2,'2024-06-11 18:48:27');
INSERT INTO "usuario_ingreso" VALUES (11,1,'2024-06-11 18:48:51');
INSERT INTO "usuario_ingreso" VALUES (12,1,'2024-06-11 18:53:54');
INSERT INTO "usuario_ingreso" VALUES (13,1,'2024-06-11 19:47:40');
INSERT INTO "usuario_ingreso" VALUES (14,1,'2024-06-11 20:18:39');
INSERT INTO "usuario_ingreso" VALUES (15,1,'2024-06-11 20:33:33');
INSERT INTO "usuario_ingreso" VALUES (16,1,'2024-06-11 20:45:36');
INSERT INTO "usuario_ingreso" VALUES (17,1,'2024-06-11 21:16:37');
INSERT INTO "usuario_ingreso" VALUES (18,1,'2024-06-11 17:18:03');
INSERT INTO "usuario_ingreso" VALUES (19,1,'2024-06-11 19:31:00');
INSERT INTO "usuario_ingreso" VALUES (20,2,'2024-06-11 19:32:45');
INSERT INTO "usuario_ingreso" VALUES (21,2,'2024-06-11 19:33:55');
INSERT INTO "usuario_ingreso" VALUES (22,1,'2024-06-11 19:36:29');
COMMIT;
