SET CHARSET utf8;

ALTER TABLE lunch_box ADD delete_flag tinyint(1) DEFAULT 0 NOT NULL AFTER update_datetime;