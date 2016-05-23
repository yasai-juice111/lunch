SET CHARSET utf8;

/**
 * ユーザー
 */
CREATE TABLE IF NOT EXISTS user (
  id              BIGINT(20)  UNSIGNED  NOT NULL  AUTO_INCREMENT  COMMENT 'ID',
  employee_id     varchar(10)           NOT NULL                  COMMENT '社員ID',
  employee_type   int(10)               NOT NULL                  COMMENT '雇用形態タイプ',
  company         varchar(100)          NOT NULL                  COMMENT '部署',
  email           varchar(100)          NOT NULL                  COMMENT 'メールアドレス',
  insert_datetime DATETIME 				      NOT NULL 					        COMMENT '作成日時',
  update_datetime DATETIME              NOT NULL                  COMMENT '更新日時',
  PRIMARY KEY (id),
  KEY (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='ユーザー';