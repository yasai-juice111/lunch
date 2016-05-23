SET CHARSET utf8;

/**
 * ランチボックス
 */
CREATE TABLE IF NOT EXISTS lunch_box (
  id              BIGINT(20)  UNSIGNED  NOT NULL  AUTO_INCREMENT  COMMENT 'ID',
  name            varchar(255)          NOT NULL                  COMMENT '名前',
  maker           varchar(255)          NOT NULL                  COMMENT '販売元',
  sale_date       DATE                  NOT NULL                  COMMENT '販売日時',
  sale_week_date  DATE                  NOT NULL                  COMMENT '販売週日時',
  price           INT(10)     UNSIGNED  NOT NULL                  COMMENT '金額',
  amount          INT(10)     UNSIGNED  NOT NULL                  COMMENT '個数',
  image_path      varchar(255)          NOT NULL                  COMMENT '画像パス',
  store           varchar(255)          NOT NULL                  COMMENT '販売元',
  insert_datetime DATETIME 				      NOT NULL 					        COMMENT '作成日時',
  update_datetime DATETIME              NOT NULL                  COMMENT '更新日時',
  PRIMARY KEY (id),
  KEY (sale_date),
  KEY (sale_week_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='ランチボックス';