from matcher import extract_skills, rank_jobs


def test_full_stack_role_ranks_first() -> None:
    resume = "Python React Node.js Express SQL MySQL REST API Docker Git testing"
    jobs = {
        "Full Stack": "React Node.js Express SQL MySQL REST API testing",
        "Data": "Python PostgreSQL AWS data pipelines",
    }
    results = rank_jobs(resume, jobs)
    assert results[0].job == "Full Stack"
    assert results[0].similarity > results[1].similarity


def test_skill_extraction_is_boundary_aware() -> None:
    skills = extract_skills("Built REST APIs in Python with Node.js and MySQL")
    assert {"python", "node.js", "mysql"}.issubset(skills)
