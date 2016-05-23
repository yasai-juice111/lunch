SET CHARSET utf8;

/**
 * ユーザーランチボックス
 */
CREATE TABLE IF NOT EXISTS user_lunch_box (
  id 				BIGINT(20) 	UNSIGNED 	NOT NULL 	AUTO_INCREMENT 	COMMENT 'ID',
  user_id 			BIGINT(20) 	UNSIGNED 	NOT NULL 					COMMENT 'ユーザーID',
  lunch_box_id		INT(10) 	UNSIGNED 	NOT NULL 					COMMENT 'ランチボックスID',
  amount			INT(10) 	UNSIGNED 	NOT NULL 					COMMENT '個数',
  cancel_flag		boolean 				NOT NULL 	DEFAULT 0		COMMENT '受け取りフラグ',
  receive_flag		boolean 				NOT NULL 	DEFAULT 0		COMMENT '受け取りフラグ',
  insert_datetime 	DATETIME 				NOT NULL 					COMMENT '作成日時',
  update_datetime 	DATETIME 				NOT NULL 					COMMENT '更新日時',
  PRIMARY KEY (id),
  KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='ユーザーランチボックス';