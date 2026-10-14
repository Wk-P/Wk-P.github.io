"""Build and serve the generated blog, independent of the working directory."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from build import build, OUT

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port', type=int, default=8014)
args = parser.parse_args()
build(include_drafts=True)
handler = partial(SimpleHTTPRequestHandler, directory=str(OUT))
try:
    server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
except OSError as error:
    parser.exit(1, f'Cannot start preview on port {args.port}: {error}. Try --port 8015.\n')
print(f'Blog preview: http://127.0.0.1:{args.port}/', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
