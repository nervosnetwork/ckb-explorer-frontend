class LockScriptSerializer
  include FastJsonapi::ObjectSerializer

  attributes :args, :code_hash
end
