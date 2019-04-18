class LockScriptSerializer
  include FastJsonapi::ObjectSerializer

  attributes :args, :binary_hash
end
