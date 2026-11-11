import json
from audits.free.privacy import private_path, owner_verified
from audits.free.requests import Request


def R(email, site, kind="site"):
    return Request(id="x", name="n", email=email, site=site, kind=kind, handle=None, url=None)


def test_private_path_is_unguessable_and_stable():
    a = {"slug": "kiimento"}
    p = private_path(a)
    assert p.startswith("kiimento-") and len(p) >= len("kiimento-") + 12
    assert private_path(a) == p  # stored, not regenerated
    assert private_path({"slug": "kiimento"}) != p


def test_owner_verified_when_email_domain_matches_site():
    assert owner_verified(R("ana@kiimento.com", "https://www.kiimento.com/shop"))
    assert owner_verified(R("ana@mail.kiimento.com", "kiimento.com"))


def test_owner_not_verified_for_free_mail_mismatch_or_instagram():
    assert not owner_verified(R("ana@gmail.com", "kiimento.com"))
    assert not owner_verified(R("ana@other.com", "kiimento.com"))
    assert not owner_verified(R("ana@geist.in", "@drinkgeist", kind="instagram"))
