SELECT 
    poll.poll_name AS pollName,
    poll.is_boost AS isBoost,
    (SELECT 
            type
        FROM
            poll_type
        WHERE
            id = poll.poll_type_id) AS pollType,
    (SELECT 
            name
        FROM
            category
        WHERE
            id = (SELECT 
                    category_id
                FROM
                    category_poll_map
                WHERE
                    poll_id = poll.id)) AS category,
    (SELECT 
            type
        FROM
            visibility_type
        WHERE
            id = poll.visibility_type_id) AS visibilityType,
    (SELECT 
            type
        FROM
            reward_type
        WHERE
            id = poll.reward_type_id) AS rewardType,
    poll.created_user_id AS createdUserId,
    question.question,
    (SELECT 
            type
        FROM
            question_type
        WHERE
            id = question.question_type_id) AS questionType,
    question_options.`option` AS choices
FROM
    poll
        INNER JOIN
    question ON question.poll_id = poll.id
        INNER JOIN
    question_options ON question_options.question_id = question.id
WHERE
    poll.id = '4';