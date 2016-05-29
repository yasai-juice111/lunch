DROP TABLE user_lunch_box_store;

SET CHARSET utf8;

/**
 * ユーザーランチボックスストア
 */
CREATE TABLE IF NOT EXISTS user_lunch_box_store (
  id 				 BIGINT(20) 	UNSIGNED 	NOT NULL 	AUTO_INCREMENT 	COMMENT 'ID',
  user_id 		  	 BIGINT(20) 	UNSIGNED 	NOT NULL 					        COMMENT 'ユーザーID',
  lunch_box_store_id INT(10) 	    UNSIGNED 	NOT NULL 					        COMMENT 'ランチボックスストアID',
  insert_datetime 	 DATETIME 				      NOT NULL 					        COMMENT '作成日時',
  update_datetime    DATETIME               NOT NULL                  COMMENT '更新日時',
  PRIMARY KEY (id),
  KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='ユーザーランチボックスストア';